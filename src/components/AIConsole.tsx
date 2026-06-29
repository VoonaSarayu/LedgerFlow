import React, { useState } from 'react';
import { Terminal, Play, Check, Copy } from 'lucide-react';

type LangType = 'node' | 'python' | 'go' | 'curl';

export const AIConsole: React.FC = () => {
  const [lang, setLang] = useState<LangType>('node');
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const codeSnippets = {
    node: `import { LedgerFlow } from '@ledgerflow/sdk';

const sdk = new LedgerFlow({ apiKey: 'lf_live_9a8f273...' });

// Configure dynamic role-based pricing model
const session = await sdk.billing.createSession({
  customer: 'cust_acme_01',
  role: 'EngineeringAdmin',
  pricingModel: 'hybrid',
  features: {
    seats: 25,
    apiLimits: 150000
  },
  aiOptimization: true
});

console.log(\`Billing Session Active: \${session.id}\`);`,

    python: `from ledgerflow import LedgerFlow

sdk = LedgerFlow(api_key='lf_live_9a8f273...')

# Configure dynamic role-based pricing model
session = sdk.billing.create_session(
    customer='cust_acme_01',
    role='EngineeringAdmin',
    pricing_model='hybrid',
    features={
        'seats': 25,
        'api_limits': 150000
    },
    ai_optimization=True
)

print(f"Billing Session Active: {session.id}")`,

    go: `package main

import (
    "fmt"
    "github.com/ledgerflow/ledgerflow-go"
)

func main() {
    client := ledgerflow.NewClient("lf_live_9a8f273...")
    
    // Configure dynamic role-based pricing model
    session, _ := client.Billing.CreateSession(ledgerflow.SessionParams{
        Customer:       "cust_acme_01",
        Role:           "EngineeringAdmin",
        PricingModel:   "hybrid",
        Seats:          25,
        ApiLimits:      150000,
        AiOptimization: true,
    })
    
    fmt.Printf("Billing Session Active: %s\\n", session.ID)
}`,

    curl: `curl -X POST https://api.ledgerflow.com/v1/sessions \\
  -H "Authorization: Bearer lf_live_9a8f273..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "customer": "cust_acme_01",
    "role": "EngineeringAdmin",
    "pricing_model": "hybrid",
    "seats": 25,
    "api_limits": 150000,
    "ai_optimization": true
  }'`
  };

  const copyCode = () => {
    navigator.clipboard.writeText(codeSnippets[lang]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Simulated terminal output logs
  const runCode = () => {
    if (isRunning) return;
    setIsRunning(true);
    setLogs([]);

    const messages = [
      '🚀 Initializing LedgerFlow SDK client...',
      '🔍 Authenticating API Key: [lf_live_9a8f273...] OK',
      '🔄 Mapping organization workspace parameters...',
      '⚖️ Validating Role entitlements (EngineeringAdmin): Passed',
      '🤖 Evaluating smart-routing dunning parameters...',
      '📦 Provisioning billing channel: LF-SUBSCRIPTION-92A',
      '✨ Billing Session Created! Active ID: sess_0281ba8',
    ];

    messages.forEach((msg, idx) => {
      setTimeout(() => {
        setLogs((prev) => [...prev, msg]);
        if (idx === messages.length - 1) {
          setIsRunning(false);
        }
      }, (idx + 1) * 600);
    });
  };

  return (
    <section
      id="platform"
      style={{
        padding: '60px 20px',
        position: 'relative',
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%',
      }}
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '40px', alignItems: 'center' }}>
        {/* Editorial copy */}
        <div style={{ gridColumn: 'span 12' }} className="lg:col-span-5 text-left">
          <span style={{ fontSize: '0.85rem', color: 'var(--accent-color)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '2px' }}>
            Developer Centric API
          </span>
          <h3 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', fontWeight: 800, marginTop: '10px', letterSpacing: '-1.2px', lineHeight: '1.2' }}>
            Integrate In Minutes, <br/>
            <span className="font-editorial shiny-text">Scale Instantly</span>
          </h3>
          <p style={{ color: 'var(--muted-color)', marginTop: '20px', fontSize: '1rem', lineHeight: '1.6' }}>
            Our unified API interfaces directly with your user identity providers. Instantly sync billing tiers to user roles like Admins, Team Leaders, and Readers without maintaining complex custom sync queries.
          </p>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '24px' }}>
            {['GraphQL & REST SDK interfaces', 'Built-in multi-tenant access models', 'Pre-audited SOC2 transaction protocols'].map((item, idx) => (
              <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', color: '#e2e8f0' }}>
                <Check size={16} color="var(--accent-color)" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Developer Console Console Block */}
        <div style={{ gridColumn: 'span 12' }} className="lg:col-span-7">
          <div style={{
            background: 'rgba(11, 18, 32, 0.75)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '20px',
            overflow: 'hidden',
            boxShadow: '0 30px 60px rgba(0,0,0,0.4)'
          }}>
            {/* Terminal Tab Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '12px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ef4444' }} />
                <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#eab308' }} />
                <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#22c55e' }} />
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                {(['node', 'python', 'go', 'curl'] as LangType[]).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => { setLang(tab); setLogs([]); }}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '6px',
                      border: 'none',
                      background: lang === tab ? 'rgba(255,255,255,0.06)' : 'transparent',
                      color: lang === tab ? '#fff' : 'var(--muted-color)',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      textTransform: 'uppercase',
                      transition: 'all 0.2s'
                    }}
                  >
                    {tab === 'node' ? 'Node.js' : tab}
                  </button>
                ))}
              </div>
              <button
                onClick={copyCode}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--muted-color)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.75rem'
                }}
              >
                {copied ? <Check size={12} color="var(--accent-color)" /> : <Copy size={12} />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>

            {/* Code Content */}
            <div style={{ padding: '24px', overflowX: 'auto', background: 'rgba(5, 8, 22, 0.4)' }}>
              <pre style={{ margin: 0 }}>
                <code style={{
                  fontFamily: 'var(--font-code)',
                  fontSize: '0.85rem',
                  color: '#e2e8f0',
                  lineHeight: '1.6',
                  textAlign: 'left',
                  display: 'block'
                }}>
                  {codeSnippets[lang]}
                </code>
              </pre>
            </div>

            {/* Terminal Actions & Output logs */}
            <div style={{
              background: '#040713',
              borderTop: '1px solid rgba(255, 255, 255, 0.05)',
              padding: '20px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--muted-color)', fontWeight: 500 }}>
                  <Terminal size={14} /> EXECUTION CONSOLE
                </span>
                <button
                  onClick={runCode}
                  disabled={isRunning}
                  style={{
                    background: 'var(--primary-color)',
                    color: '#fff',
                    border: '1px solid rgba(255,255,255,0.15)',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: isRunning ? 'default' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '0 4px 15px rgba(109, 93, 246, 0.3)',
                    transition: 'all 0.3s'
                  }}
                  onMouseEnter={(e) => { if (!isRunning) e.currentTarget.style.transform = 'translateY(-1px)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  <Play size={12} fill="#fff" />
                  {isRunning ? 'Running...' : 'Run SDK Script'}
                </button>
              </div>

              {/* Shell output area */}
              <div style={{
                background: '#02040a',
                borderRadius: '8px',
                padding: '16px',
                minHeight: '130px',
                border: '1px solid rgba(255,255,255,0.03)',
                fontFamily: 'var(--font-code)',
                fontSize: '0.75rem',
                lineHeight: '1.7',
                color: 'var(--muted-color)'
              }}>
                {logs.length === 0 ? (
                  <span style={{ color: 'rgba(255,255,255,0.2)' }}>Click "Run SDK Script" to test LedgerFlow API...</span>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {logs.map((log, idx) => (
                      <span key={idx} style={{ color: log.includes('sess_') || log.includes('Created!') ? 'var(--accent-color)' : '#94a3b8' }}>
                        {log}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
