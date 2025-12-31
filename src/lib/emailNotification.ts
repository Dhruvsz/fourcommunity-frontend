// Email notification system for community submissions
import emailjs from '@emailjs/browser';

// EmailJS configuration from environment variables
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_groupfinder';
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_submission';
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'your_public_key';

// Initialize EmailJS if configured
if (EMAILJS_PUBLIC_KEY && EMAILJS_PUBLIC_KEY !== 'your_public_key') {
  emailjs.init(EMAILJS_PUBLIC_KEY);
  console.log('✅ EmailJS initialized with environment variables');
} else {
  console.log('⚠️ EmailJS not configured - using fallback methods only');
}

export interface SubmissionNotificationData {
  community_name: string;
  founder_name: string;
  founder_email?: string;
  category: string;
  platform: string;
  short_description: string;
  join_link: string;
  submitted_at: string;
  submission_id: string;
}

export class EmailNotificationService {
  private static instance: EmailNotificationService;
  
  static getInstance(): EmailNotificationService {
    if (!EmailNotificationService.instance) {
      EmailNotificationService.instance = new EmailNotificationService();
    }
    return EmailNotificationService.instance;
  }

  // Send email notification for new submission
  async sendSubmissionNotification(submissionData: SubmissionNotificationData): Promise<boolean> {
    try {
      console.log('📧 Sending email notification for new submission:', submissionData.community_name);

      // Check if EmailJS is configured
      if (!EMAILJS_PUBLIC_KEY || EMAILJS_PUBLIC_KEY === 'your_public_key') {
        console.log('⚠️ EmailJS not configured, using fallback method');
        throw new Error('EmailJS not configured');
      }

      // Prepare email template parameters
      const templateParams = {
        to_email: 'dhruvchoudhary751@gmail.com',
        to_name: 'Dhruv Choudhary',
        community_name: submissionData.community_name,
        founder_name: submissionData.founder_name,
        founder_email: submissionData.founder_email || 'Not provided',
        category: submissionData.category,
        platform: submissionData.platform,
        description: submissionData.short_description,
        join_link: submissionData.join_link,
        submitted_at: new Date(submissionData.submitted_at).toLocaleString(),
        submission_id: submissionData.submission_id,
        admin_link: `${window.location.origin}/admin/submissions`,
        subject: `🚀 New Community Submission: ${submissionData.community_name}`
      };

      // Send email using EmailJS
      const response = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams
      );

      if (response.status === 200) {
        console.log('✅ EmailJS notification sent successfully');
        return true;
      } else {
        console.error('❌ EmailJS notification failed:', response);
        return false;
      }

    } catch (error) {
      console.error('❌ Error sending EmailJS notification:', error);
      
      // Fallback: Try alternative method
      try {
        await this.sendFallbackNotification(submissionData);
        return true;
      } catch (fallbackError) {
        console.error('❌ Fallback notification also failed:', fallbackError);
        return false;
      }
    }
  }

  // Fallback notification method using Netlify Forms
  private async sendFallbackNotification(submissionData: SubmissionNotificationData): Promise<void> {
    console.log('📧 Trying fallback notification method...');

    const formData = new FormData();
    formData.append('form-name', 'submission-notification');
    formData.append('to', 'dhruvchoudhary751@gmail.com');
    formData.append('subject', `🚀 New Community Submission: ${submissionData.community_name}`);
    formData.append('message', `
New Community Submission Details:

Community Name: ${submissionData.community_name}
Founder: ${submissionData.founder_name}
Email: ${submissionData.founder_email || 'Not provided'}
Category: ${submissionData.category}
Platform: ${submissionData.platform}
Description: ${submissionData.short_description}
Join Link: ${submissionData.join_link}
Submitted: ${new Date(submissionData.submitted_at).toLocaleString()}
Submission ID: ${submissionData.submission_id}

Admin Panel: ${window.location.origin}/admin/submissions
    `);

    const response = await fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(formData as any).toString()
    });

    if (!response.ok) {
      throw new Error('Fallback notification failed');
    }

    console.log('✅ Fallback notification sent successfully');
  }

  // Simple webhook notification (if you set up a webhook endpoint)
  async sendWebhookNotification(submissionData: SubmissionNotificationData): Promise<boolean> {
    try {
      // You can replace this with your own webhook URL
      const webhookUrl = 'https://hooks.zapier.com/hooks/catch/your-webhook-id/'; // Optional
      
      if (!webhookUrl.includes('your-webhook-id')) {
        console.log('⚠️ Webhook URL not configured, skipping webhook notification');
        return false;
      }

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'new_submission',
          data: submissionData,
          notification_email: 'dhruvchoudhary751@gmail.com',
          timestamp: new Date().toISOString()
        })
      });

      if (response.ok) {
        console.log('✅ Webhook notification sent successfully');
        return true;
      } else {
        console.error('❌ Webhook notification failed:', response.status);
        return false;
      }

    } catch (error) {
      console.error('❌ Webhook notification error:', error);
      return false;
    }
  }
}

// Export singleton instance
export const emailNotificationService = EmailNotificationService.getInstance();

// Helper function to send notification
export const notifyNewSubmission = async (submissionData: SubmissionNotificationData): Promise<void> => {
  console.log('📧 NOTIFICATION: Processing new submission notification...');
  
  try {
    // Try multiple notification methods
    const emailSent = await emailNotificationService.sendSubmissionNotification(submissionData);
    const webhookSent = await emailNotificationService.sendWebhookNotification(submissionData);
    
    if (emailSent || webhookSent) {
      console.log('✅ NOTIFICATION: At least one notification method succeeded');
    } else {
      console.log('⚠️ NOTIFICATION: All notification methods failed, but submission was saved');
    }
    
  } catch (error) {
    console.error('❌ NOTIFICATION: Error in notification system:', error);
    // Don't throw error - submission should still succeed even if notification fails
  }
};