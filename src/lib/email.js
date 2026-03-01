import { Resend } from 'resend';

const resend = new Resend('re_jM5eCLPw_HhcriGJv77mCyFvE3e6tPBHW');

export async function sendOrderNotification(orderData) {
    try {
        const { 
            customerName, 
            phone, 
            wilaya, 
            commune, 
            shippingType, 
            items, 
            totalPrice 
        } = orderData;

        // Format order items for email
        const itemsList = items.map(item => `
            <tr>
                <td style="padding: 8px; border-bottom: 1px solid #eee;">
                    <strong>${item.productName}</strong><br>
                    <small>Couleur: ${item.color} | Taille: ${item.size}</small>
                </td>
                <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
                <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">${item.price.toLocaleString()} DA</td>
                <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">${(item.price * item.quantity).toLocaleString()} DA</td>
            </tr>
        `).join('');

        const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Nouvelle Commande - Radiossa Shop</title>
            </head>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background: linear-gradient(135deg, #8B4513 0%, #A0522D 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                    <h1 style="color: white; margin: 0; font-size: 28px;">🛍️ Nouvelle Commande Reçue</h1>
                    <p style="color: #f0f0f0; margin: 10px 0 0 0; font-size: 16px;">Radiossa Shop - Boutique de Vêtements</p>
                </div>
                
                <div style="background: white; padding: 30px; border: 1px solid #eee; border-top: none; border-radius: 0 0 10px 10px;">
                    <h2 style="color: #8B4513; margin-top: 0;">Détails de la Commande</h2>
                    
                    <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
                        <h3 style="margin-top: 0; color: #333;">Informations Client</h3>
                        <p><strong>👤 Nom:</strong> ${customerName}</p>
                        <p><strong>📞 Téléphone:</strong> ${phone}</p>
                        <p><strong>📍 Wilaya:</strong> ${wilaya}</p>
                        <p><strong>🏘️ Commune:</strong> ${commune}</p>
                        <p><strong>🚚 Type de Livraison:</strong> ${shippingType}</p>
                    </div>
                    
                    <h3 style="color: #8B4513;">Articles Commandés</h3>
                    <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px;">
                        <thead>
                            <tr style="background: #8B4513; color: white;">
                                <th style="padding: 12px; text-align: left;">Produit</th>
                                <th style="padding: 12px; text-align: center;">Qté</th>
                                <th style="padding: 12px; text-align: right;">Prix Unitaire</th>
                                <th style="padding: 12px; text-align: right;">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${itemsList}
                        </tbody>
                    </table>
                    
                    <div style="background: #8B4513; color: white; padding: 20px; border-radius: 8px; text-align: center;">
                        <h3 style="margin: 0; font-size: 24px;">💰 Total: ${totalPrice.toLocaleString()} DA</h3>
                    </div>
                    
                    <div style="margin-top: 30px; text-align: center; padding: 20px; background: #f0f8ff; border-radius: 8px;">
                        <p style="margin: 0; color: #666;">
                            <strong>📅 Date:</strong> ${new Date().toLocaleDateString('fr-FR')}<br>
                            <strong>⏰ Heure:</strong> ${new Date().toLocaleTimeString('fr-FR')}
                        </p>
                    </div>
                </div>
                
                <div style="text-align: center; margin-top: 20px; color: #888; font-size: 12px;">
                    <p>Ce message a été envoyé automatiquement par Radiossa Shop</p>
                    <p>radiossa.shop@gmail.com</p>
                </div>
            </body>
            </html>
        `;

        const response = await resend.emails.send({
            from: 'Radiossa Shop <radiossa.shop@gmail.com>',
            to: 'radiossa.shop@gmail.com',
            subject: `🛍️ Nouvelle Commande - ${customerName} (${totalPrice.toLocaleString()} DA)`,
            html: htmlContent,
        });

        console.log('Email sent successfully:', response);
        return { success: true, data: response };
    } catch (error) {
        console.error('Error sending email:', error);
        return { success: false, error: error.message };
    }
}