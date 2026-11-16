// SITE-WIDE SETTINGS. Edit here and the whole site updates.
export default {
  name: 'PRAMANDI',
  tagline: 'Dress like the group chat',
  currency: '₦',
  accent: '#39F27A',
  shippingNote: 'Delivery across Nigeria in 2 to 5 working days.',
  contact: {email: 'hello@pramandi.com', phone: '+234 000 000 0000', instagram: 'https://instagram.com/pramandi'},
  delivery: [
    {id: 'standard', label: 'Standard (3-5 days)', fee: 3000},
    {id: 'express', label: 'Express (1-2 days)', fee: 6000},
    {id: 'pickup', label: 'Pickup (free)', fee: 0}
  ],
  promos: {PRAMANDI10: 10, WELCOME5: 5},  // code: percent off
  // HOMEPAGE COPY (sample text: replace with your own)
  features: [
    {t: 'Heavyweight cotton', d: '240gsm fabric that keeps its shape wash after wash.'},
    {t: 'Limited drops', d: 'Small runs. When a size is gone, it is gone.'},
    {t: 'Delivered nationwide', d: 'Pay online and get it at your door in 2 to 5 days.'}
  ],
  faq: [
    {q: 'How do the sizes fit?', a: 'Our tops are cut boxy. Size up one for an oversized look.'},
    {q: 'How long does delivery take?', a: 'Standard delivery takes 3 to 5 working days, express takes 1 to 2.'},
    {q: 'Can I return or exchange an item?', a: 'Yes, unworn items can be exchanged within 7 days. Contact us to start.'}
  ]
}
