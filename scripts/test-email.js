import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

async function testEmail() {
    const apiKey = process.env.RESEND_API_KEY;
    const emailTo = process.env.EMAIL_TO || 'radiossa.shop@gmail.com';
    const emailFrom = process.env.EMAIL_FROM || 'onboarding@resend.dev';

    console.log('--- Email Test ---');
    console.log('API Key Present:', apiKey ? 'Yes' : 'No');
    console.log('From:', emailFrom);
    console.log('To:', emailTo);

    try {
        const { data, error } = await resend.emails.send({
            from: `Radiossa Shop <${emailFrom}>`,
            to: emailTo,
            subject: 'Test Email from Radiossa Store',
            html: '<p>If you see this, your email notification system is working!</p>'
        });

        if (error) {
            console.error('❌ Resend Error:', error);
            if (error.name === 'validation_error' || error.message?.includes('onboarding')) {
                console.log('💡 Tip: Use "onboarding@resend.dev" as FROM and your registered email as TO for testing.');
            }
        } else {
            console.log('✅ Success! ID:', data.id);
        }
    } catch (err) {
        console.error('💥 Unexpected Error:', err);
    }
}

testEmail();
