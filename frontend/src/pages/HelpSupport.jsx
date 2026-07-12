import { useNavigate } from 'react-router-dom'
import DesktopSidebar from '../components/DesktopSidebar'

export default function HelpSupport() {
  const navigate = useNavigate()
  const faqs = [
    { q: 'How do I create a profile?', a: 'Sign up with your phone number, complete verification, and fill in your details. Add photos and a bio to attract more matches!' },
    { q: 'How does matching work?', a: 'Swipe right on profiles you like. If they like you back, it\'s a match! You can then start chatting.' },
    { q: 'How do I withdraw earnings?', a: 'Go to Earnings > Withdraw. Enter your M-Pesa number and amount (minimum KSh 500). Withdrawals are processed within 24-48 hours.' },
    { q: 'How do I earn money?', a: 'Earn 50 KSh for each friend you refer who pays the membership fee. You can also earn by completing your profile and being active on the platform.' },
    { q: 'Is my data secure?', a: 'Yes! We use encryption and never share your personal information with other users without your consent.' },
    { q: 'How do I report someone?', a: 'Tap the three dots on any profile and select "Report". We review all reports within 24 hours.' },
    { q: 'Can I change my location?', a: 'You can update your location in your profile settings. You can set it to your current area or a different city.' },
    { q: 'How do matches expire?', a: 'Matches don\'t expire, but if you don\'t chat with a match within 7 days, you\'ll need to reconnect.' },
  ]

  return (
    <div className="bg-surface text-on-surface font-body-md antialiased min-h-screen pb-24 md:ml-[240px]">
      <DesktopSidebar />
      <header className="bg-surface/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="flex items-center px-gutter h-16 max-w-container-max mx-auto">
          <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-high transition-colors active:scale-95 text-on-surface-variant">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="font-headline-md text-headline-md text-on-surface flex-1 text-center pr-10">Help & Support</h1>
        </div>
      </header>
      <main className="px-gutter max-w-[500px] mx-auto">
        <div className="bg-surface-container-lowest rounded-2xl p-4 border border-outline-variant/30 shadow-sm mb-6">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[24px] text-primary">support_agent</span>
            <div>
              <p className="font-label-lg text-label-lg text-on-surface">Need help?</p>
              <p className="font-body-sm text-body-sm text-on-surface-variant">Our support team is here for you.</p>
            </div>
          </div>
        </div>
        <h2 className="font-headline-sm text-headline-sm text-on-surface mb-4">Frequently Asked Questions</h2>
        <div className="space-y-3 mb-8">
          {faqs.map((faq, i) => (
            <details key={i} className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-sm group">
              <summary className="p-4 cursor-pointer font-label-md text-label-md text-on-surface flex items-center justify-between hover:bg-surface-container-high/50 rounded-2xl transition-colors">
                {faq.q}
                <span className="material-symbols-outlined text-on-surface-variant group-open:rotate-180 transition-transform text-[20px]">expand_more</span>
              </summary>
              <div className="px-4 pb-4 pt-0 text-on-surface-variant font-body-sm text-body-sm leading-relaxed">{faq.a}</div>
            </details>
          ))}
        </div>
        <h2 className="font-headline-sm text-headline-sm text-on-surface mb-4">Contact Us</h2>
        <div className="grid grid-cols-1 gap-3">
          <ContactOption icon="chat" title="Live Chat" desc="Chat with our support team" action="Start Chat" />
          <ContactOption icon="email" title="Email Us" desc="support@mingle.co.ke" action="Send Email" />
          <ContactOption icon="flag" title="Report an Issue" desc="Let us know about any problems" action="Report" />
          <ContactOption icon="menu_book" title="Community Guidelines" desc="Read our rules and policies" action="Read More" />
        </div>
      </main>
    </div>
  )
}

function ContactOption({ icon, title, desc, action }) {
  return (
    <button className="bg-surface-container-lowest rounded-2xl p-4 border border-outline-variant/30 shadow-sm flex items-center gap-4 hover:bg-surface-container-high/50 transition-colors text-left">
      <span className="material-symbols-outlined text-[24px] text-primary">{icon}</span>
      <div className="flex-1">
        <p className="font-label-md text-label-md text-on-surface">{title}</p>
        <p className="font-body-sm text-body-sm text-on-surface-variant">{desc}</p>
      </div>
      <span className="material-symbols-outlined text-on-surface-variant text-[20px]">chevron_right</span>
    </button>
  )
}
