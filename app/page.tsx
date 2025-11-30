'use client';
import { useUser, SignInButton, UserButton, SignedIn, SignedOut, useAuth } from '@clerk/nextjs';
import { useState, useEffect, useCallback } from 'react';

export default function Home() {
  const { user } = useUser();
  const { getToken } = useAuth();
  const [jwt, setJwt] = useState<string>('');
  const [fileCount, setFileCount] = useState<number>(3);
  const [jsonOutput, setJsonOutput] = useState<any>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Auto-refresh JWT every 30 seconds
  const refreshJwt = useCallback(async () => {
    if (!user || isRefreshing) return;
    
    setIsRefreshing(true);
    try {
      const token = await getToken({ skipCache: true });
      if (token) {
        setJwt(token);
        console.log('JWT refreshed automatically');
      }
    } catch (error) {
      console.error('Failed to refresh JWT:', error);
    } finally {
      setIsRefreshing(false);
    }
  }, [user, getToken, isRefreshing]);

  // Initial JWT fetch and auto-refresh setup
  useEffect(() => {
    if (user) {
      refreshJwt();
      
      // Auto-refresh every 30 seconds
      const interval = setInterval(refreshJwt, 30000);
      return () => clearInterval(interval);
    }
  }, [user, refreshJwt]);

  // Generate UUID v4
  const generateUuid = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };

  // Generate API JSON with UUID v4 IDs (no request_id)
  const generateApiJson = useCallback(() => {
    if (!jwt) return;

    const ids = Array(fileCount).fill(0).map(() => generateUuid());
    
    // Input format (removed request_id)
    const input = {
      jwt: jwt.trim(), // Trim spaces from JWT
      ids: ids
    };

    // Expected output format (removed request_id)
    const keysMap: { [key: string]: string } = {};
    ids.forEach(id => {
      keysMap[id] = `base64EncodedKey${Math.random().toString(36).substr(2, 9)}==`;
    });
    
    const output = {
      keys: keysMap
    };

    setJsonOutput({ input, output });
  }, [jwt, fileCount]);

  // Auto-regenerate JSON when JWT or file count changes
  useEffect(() => {
    if (jwt) {
      generateApiJson();
    }
  }, [jwt, fileCount, generateApiJson]);

  const copyToClipboard = (text: string) => {
    // Trim spaces and copy compact JSON
    const trimmedText = text.trim();
    navigator.clipboard.writeText(trimmedText);
  };

  const styles = {
    container: {
      maxWidth: '1000px',
      margin: '2rem auto',
      padding: '2rem',
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      backgroundColor: '#f8f9fa',
      minHeight: '100vh'
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '2rem',
      marginBottom: '2rem',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      border: '1px solid #e5e7eb'
    },
    title: {
      fontSize: '2.5rem',
      fontWeight: '700',
      color: '#1f2937',
      textAlign: 'center' as const,
      marginBottom: '2rem',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text'
    },
    jwtCard: {
      backgroundColor: '#fef3c7',
      border: '2px solid #f59e0b',
      borderRadius: '12px',
      padding: '1.5rem'
    },
    jwtText: {
      fontFamily: 'Consolas, Monaco, "Courier New", monospace',
      fontSize: '0.9rem',
      backgroundColor: 'white',
      padding: '1rem',
      borderRadius: '8px',
      border: '1px solid #d1d5db',
      wordBreak: 'break-all' as const,
      maxHeight: '120px',
      overflow: 'auto',
      color: '#374151'
    },
    button: {
      padding: '0.75rem 1.5rem',
      fontSize: '1rem',
      fontWeight: '600',
      borderRadius: '8px',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem'
    },
    primaryButton: {
      backgroundColor: '#3b82f6',
      color: 'white'
    },
    successButton: {
      backgroundColor: '#10b981',
      color: 'white'
    },
    refreshButton: {
      backgroundColor: '#f59e0b',
      color: 'white'
    },
    copyButton: {
      backgroundColor: '#0891b2',
      color: 'white',
      padding: '0.5rem 1rem',
      fontSize: '0.9rem'
    },
    input: {
      width: '100%',
      padding: '0.75rem',
      fontSize: '1rem',
      border: '2px solid #e5e7eb',
      borderRadius: '8px',
      marginBottom: '1rem',
      boxSizing: 'border-box' as const
    },
    codeBlock: {
      backgroundColor: '#1f2937',
      color: '#f9fafb',
      padding: '1.5rem',
      borderRadius: '8px',
      fontSize: '0.85rem',
      fontFamily: 'Consolas, Monaco, "Courier New", monospace',
      whiteSpace: 'pre-wrap' as const,
      wordBreak: 'break-all' as const,
      maxHeight: '300px',
      overflow: 'auto',
      border: '1px solid #374151'
    },
    outputBlock: {
      backgroundColor: '#064e3b',
      color: '#f0fdf4',
      padding: '1.5rem',
      borderRadius: '8px',
      fontSize: '0.85rem',
      fontFamily: 'Consolas, Monaco, "Courier New", monospace',
      whiteSpace: 'pre-wrap' as const,
      wordBreak: 'break-all' as const,
      maxHeight: '300px',
      overflow: 'auto',
      border: '1px solid #065f46'
    },
    userInfo: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '1.5rem',
      backgroundColor: '#ecfdf5',
      borderRadius: '8px',
      border: '1px solid #d1fae5'
    },
    controls: {
      display: 'flex',
      gap: '1rem',
      alignItems: 'center',
      marginBottom: '1.5rem',
      flexWrap: 'wrap' as const
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Vault Server Client - Auto-Refresh JWT</h1>
      
      <SignedOut>
        <div style={styles.card}>
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <h2 style={{ fontSize: '1.5rem', color: '#374151', marginBottom: '1.5rem' }}>
              Please sign in to access JWT and API testing
            </h2>
            <SignInButton mode="modal">
              <button style={{...styles.button, ...styles.primaryButton}}>
                Sign In with Clerk
              </button>
            </SignInButton>
          </div>
        </div>
      </SignedOut>

      <SignedIn>
        <div style={styles.card}>
          <div style={styles.userInfo}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#065f46' }}>
                Welcome, {user?.firstName || user?.username || 'User'}!
              </h3>
              <p style={{ margin: '0.5rem 0 0 0', color: '#6b7280' }}>
                {user?.primaryEmailAddress?.emailAddress}
              </p>
              <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem', color: '#6b7280' }}>
                Auto-refreshes every 30 seconds
              </p>
            </div>
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>

        {/* JWT Only Section */}
        <div style={{...styles.card, ...styles.jwtCard}}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#92400e' }}>
              JWT Token (Auto-Refreshed)
            </h3>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => copyToClipboard(jwt)}
                disabled={!jwt}
                style={{...styles.button, ...styles.copyButton}}
              >
                Copy JWT
              </button>
              <button
                onClick={refreshJwt}
                disabled={isRefreshing}
                style={{...styles.button, ...styles.refreshButton}}
              >
                {isRefreshing ? 'Refreshing...' : 'Refresh Now'}
              </button>
            </div>
          </div>
          <div style={styles.jwtText}>
            {jwt || 'Loading JWT token...'}
          </div>
        </div>

        {/* Controls */}
        <div style={styles.card}>
          <h3 style={{ fontSize: '1.25rem', color: '#374151', marginBottom: '1rem' }}>
            API JSON Generator (Auto-Updates)
          </h3>
          <div style={styles.controls}>
            <label style={{ fontSize: '1rem', fontWeight: '600', color: '#374151' }}>
              IDs per request:
            </label>
            <input
              type="number"
              min="1"
              max="20"
              value={fileCount}
              onChange={(e) => setFileCount(parseInt(e.target.value) || 1)}
              style={{...styles.input, width: '100px', margin: 0}}
            />
            <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
              (All IDs are UUID v4)
            </span>
          </div>
          <p style={{ color: '#6b7280', fontSize: '0.9rem', margin: 0 }}>
            JSON auto-updates when JWT refreshes or ID count changes
          </p>
        </div>

        {/* API Input JSON */}
        {jsonOutput && (
          <div style={styles.card}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#374151' }}>
                Input JSON (Send to Server)
              </h3>
              <button
                onClick={() => copyToClipboard(JSON.stringify(jsonOutput.input))}
                style={{...styles.button, ...styles.copyButton}}
              >
                Copy Compact JSON
              </button>
            </div>
            <div style={styles.codeBlock}>
              {JSON.stringify(jsonOutput.input)}
            </div>
          </div>
        )}

        {/* Expected Output JSON */}
        {jsonOutput && (
          <div style={styles.card}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#374151' }}>
                Expected Output JSON
              </h3>
              <button
                onClick={() => copyToClipboard(JSON.stringify(jsonOutput.output))}
                style={{...styles.button, ...styles.copyButton}}
              >
                Copy Compact JSON
              </button>
            </div>
            <div style={styles.outputBlock}>
              {JSON.stringify(jsonOutput.output)}
            </div>
          </div>
        )}

        {/* Usage Instructions */}
        <div style={styles.card}>
          <h4 style={{ fontSize: '1.25rem', color: '#1e40af', marginBottom: '1rem' }}>
            Usage Instructions
          </h4>
          <ol style={{ color: '#374151', lineHeight: '1.6' }}>
            <li><strong>JWT Auto-Refresh:</strong> Token automatically refreshes every 30 seconds</li>
            <li><strong>UUID v4 IDs:</strong> All IDs are proper UUID v4 format</li>
            <li><strong>Compact JSON:</strong> Output is space-trimmed for production use</li>
            <li><strong>Auto-Update:</strong> JSON regenerates when JWT refreshes or ID count changes</li>
            <li><strong>Easy Copy:</strong> Click any "Copy" button to copy compact JSON to clipboard</li>
            <li><strong>No Request ID:</strong> Updated format removes request_id field</li>
          </ol>
          
          <div style={{ 
            marginTop: '1rem', 
            padding: '1rem', 
            backgroundColor: '#1e40af', 
            borderRadius: '6px',
            color: 'white',
            fontFamily: 'monospace',
            fontSize: '0.9rem'
          }}>
            <div><strong>CLI Usage:</strong> echo 'JSON' | cargo run --bin vault-client</div>
            <div><strong>Test Menu:</strong> cargo run --bin test-client</div>
            <div><strong>Format:</strong> Compact JSON (no spaces), UUID v4 IDs</div>
          </div>
        </div>
      </SignedIn>
    </div>
  );
}

