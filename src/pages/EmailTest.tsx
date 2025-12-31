import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';

const EmailTest = () => {
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState<string>('');

  const testEmail = async () => {
    setTesting(true);
    setResult('');

    try {
      const testData = {
        community_name: 'Test Community',
        founder_name: 'Test Founder',
        category: 'Technology',
        platform: 'whatsapp',
        short_description: 'This is a test email notification from your Four Community platform',
        join_link: 'https://example.com/join',
        submitted_at: new Date().toISOString(),
        submission_id: `test-${Date.now()}`
      };

      toast.loading('Sending test email...', { id: 'email-test' });

      const response = await fetch('/.netlify/functions/send-notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(testData)
      });

      const data = await response.json();

      toast.dismiss('email-test');

      if (response.ok) {
        setResult(`✅ Success! Email sent to dhruv@fourcommunity.com\n\nEmail ID: ${data.emailId || 'N/A'}`);
        toast.success('Test email sent!', {
          description: 'Check dhruv@fourcommunity.com'
        });
      } else {
        setResult(`❌ Failed to send email\n\nError: ${data.error}\nDetails: ${JSON.stringify(data.details, null, 2)}`);
        toast.error('Email failed', {
          description: data.error
        });
      }
    } catch (error: any) {
      toast.dismiss('email-test');
      setResult(`❌ Error: ${error.message}`);
      toast.error('Test failed', {
        description: error.message
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <Card className="p-6 bg-gray-800 border-gray-700">
          <h1 className="text-2xl font-bold text-white mb-4">📧 Email Notification Test</h1>
          <p className="text-gray-300 mb-6">
            Test the email notification system. This will send a test email to dhruv@fourcommunity.com
          </p>

          <div className="mb-6">
            <Button 
              onClick={testEmail}
              disabled={testing}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {testing ? 'Sending...' : '📧 Send Test Email'}
            </Button>
          </div>

          {result && (
            <div className="bg-gray-900 p-4 rounded border border-gray-600 mb-6">
              <h3 className="text-white font-semibold mb-3">Result:</h3>
              <pre className="text-sm font-mono whitespace-pre-wrap">
                {result.includes('✅') ? (
                  <span className="text-green-400">{result}</span>
                ) : (
                  <span className="text-red-400">{result}</span>
                )}
              </pre>
            </div>
          )}

          <div className="p-4 bg-blue-900/30 border border-blue-700 rounded-lg mb-6">
            <h3 className="text-blue-300 font-semibold mb-2">📋 Setup Checklist:</h3>
            <ul className="text-blue-200 text-sm space-y-2">
              <li>✓ Resend account created</li>
              <li>✓ API key generated</li>
              <li>✓ RESEND_API_KEY added to Netlify env vars</li>
              <li>✓ Code deployed</li>
              <li>→ Click button above to test</li>
              <li>→ Check dhruv@fourcommunity.com inbox</li>
            </ul>
          </div>

          <div className="p-4 bg-yellow-900/30 border border-yellow-700 rounded-lg">
            <h3 className="text-yellow-300 font-semibold mb-2">⚠️ If Test Fails:</h3>
            <ul className="text-yellow-200 text-sm space-y-1 list-disc list-inside">
              <li>Check Netlify env vars for RESEND_API_KEY</li>
              <li>Verify API key starts with "re_"</li>
              <li>Check Netlify function logs</li>
              <li>Make sure you deployed after adding env var</li>
              <li>Check spam folder</li>
            </ul>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <a 
              href="https://resend.com/api-keys" 
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded text-center"
            >
              🔑 Get Resend API Key
            </a>
            <a 
              href="/submit/complete" 
              target="_blank"
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-center"
            >
              🌟 Test Real Form
            </a>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default EmailTest;
