import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { Mail, Send, Loader2 } from 'lucide-react';

interface CustomerEmailDialogProps {
  customer: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const emailTemplates = {
  welcome: {
    subject: 'Welcome to Gacinia Pharmacy!',
    body: `Dear {{customerName}},

Welcome to Gacinia Pharmacy & Medical Supplies! We're thrilled to have you as our valued customer.

As a new member, you can enjoy:
• Fast and reliable delivery
• Quality pharmaceutical products
• Professional customer support
• Special offers and discounts

If you have any questions, feel free to contact us.

Best regards,
Gacinia Pharmacy Team`
  },
  promotion: {
    subject: 'Special Offer Just for You!',
    body: `Dear {{customerName}},

We have an exclusive offer just for you!

Get 10% off on your next order with code: SAVE10

This offer is valid until the end of this month. Don't miss out!

Shop now and save on all your medical needs.

Best regards,
Gacinia Pharmacy Team`
  },
  followup: {
    subject: 'How was your recent order?',
    body: `Dear {{customerName}},

We hope you're satisfied with your recent order from Gacinia Pharmacy.

Your feedback is important to us. If you have any concerns or suggestions, please don't hesitate to reach out.

We look forward to serving you again soon!

Best regards,
Gacinia Pharmacy Team`
  },
  custom: {
    subject: '',
    body: ''
  }
};

export function CustomerEmailDialog({ customer, open, onOpenChange }: CustomerEmailDialogProps) {
  const [template, setTemplate] = useState<keyof typeof emailTemplates>('custom');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [sending, setSending] = useState(false);

  const handleTemplateChange = (value: keyof typeof emailTemplates) => {
    setTemplate(value);
    const selectedTemplate = emailTemplates[value];
    setSubject(selectedTemplate.subject);
    setBody(selectedTemplate.body.replace('{{customerName}}', customer?.name || 'Valued Customer'));
  };

  const handleSendEmail = async () => {
    if (!subject.trim() || !body.trim()) {
      toast.error('Please fill in both subject and message');
      return;
    }

    setSending(true);
    try {
      // Simulate email sending (replace with actual email service)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real implementation, you would call your email service here
      // Example: await sendEmail({ to: customer.email, subject, body });
      
      toast.success(`Email sent successfully to ${customer.name}`);
      onOpenChange(false);
      
      // Reset form
      setTemplate('custom');
      setSubject('');
      setBody('');
    } catch (error) {
      toast.error('Failed to send email. Please try again.');
    } finally {
      setSending(false);
    }
  };

  if (!customer) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Send Email to {customer.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Email Template</Label>
            <Select value={template} onValueChange={handleTemplateChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="custom">Custom Message</SelectItem>
                <SelectItem value="welcome">Welcome Email</SelectItem>
                <SelectItem value="promotion">Promotional Offer</SelectItem>
                <SelectItem value="followup">Order Follow-up</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>To</Label>
            <Input value={customer.email} disabled className="bg-muted" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter email subject"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="body">Message</Label>
            <Textarea
              id="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Enter your message"
              rows={8}
              className="resize-none"
            />
          </div>

          <div className="text-xs text-muted-foreground">
            <p>💡 Tip: Use {'{{customerName}}'} in templates to personalize messages</p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={sending}
          >
            Cancel
          </Button>
          <Button onClick={handleSendEmail} disabled={sending}>
            {sending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Send Email
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
