import { useNavigate } from 'react-router-dom'

export default function Onboarding() {
  const navigate = useNavigate()

  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col font-sans antialiased overflow-hidden">
      <main className="flex-grow flex flex-col justify-between max-w-container-max mx-auto w-full h-screen relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute -top-[10%] -right-[10%] w-[50%] h-[40%] bg-primary-container opacity-[0.03] blur-[100px] rounded-full"></div>
          <div className="absolute bottom-[20%] -left-[10%] w-[60%] h-[50%] bg-tertiary-container opacity-[0.03] blur-[120px] rounded-full"></div>
        </div>
        <header className="flex justify-end p-gutter relative z-10 w-full">
          <button onClick={() => navigate('/signup')} className="text-on-surface-variant font-label-md text-label-md hover:text-primary transition-colors py-2 px-4">Skip</button>
        </header>
        <div className="flex-grow flex flex-col items-center justify-center px-gutter md:px-xl relative z-10 w-full mb-8">
          <div className="w-full max-w-md aspect-square relative mb-xl flex items-center justify-center">
            <div className="relative w-full h-full flex items-center justify-center">
              <div className="absolute z-20 w-32 h-32 rounded-full glass-panel flex items-center justify-center animate-bounce">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-container/20 to-tertiary/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary-container text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>diversity_3</span>
                </div>
              </div>
              <div className="absolute top-10 left-10 z-10 animate-bounce" style={{ animationDelay: '0.5s' }}>
                <div className="w-16 h-16 rounded-full bg-white/70 backdrop-blur-md flex items-center justify-center shadow-[0_10px_30px_rgba(216,27,96,0.15)]">
                  <span className="material-symbols-outlined text-primary-container text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>monetization_on</span>
                </div>
              </div>
              <div className="absolute bottom-16 right-10 z-10 animate-bounce" style={{ animationDelay: '1s' }}>
                <div className="w-14 h-14 rounded-full bg-white/70 backdrop-blur-md flex items-center justify-center shadow-[0_10px_30px_rgba(141,34,169,0.15)]">
                  <span className="material-symbols-outlined text-tertiary text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>emoji_events</span>
                </div>
              </div>
              <div className="absolute top-1/2 -left-4 z-10 animate-bounce" style={{ animationDelay: '0.2s' }}>
                <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center shadow-md">
                  <span className="material-symbols-outlined text-on-secondary-container text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                </div>
              </div>
            </div>
          </div>
          <div className="text-center max-w-sm md:max-w-xl mx-auto space-y-4">
            <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">
              Build your network while growing your earnings.
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-sm mx-auto">
              Connect with quality matches and earn rewards for meaningful interactions within our premium ecosystem.
            </p>
          </div>
        </div>
        <div className="w-full px-gutter pb-[calc(24px+env(safe-area-inset-bottom))] pt-md relative z-10 bg-gradient-to-t from-surface via-surface to-transparent">
          <div className="max-w-md mx-auto space-y-md">
            <div className="flex justify-center items-center space-x-2 mb-md">
              <div className="w-2 h-2 rounded-full bg-surface-variant"></div>
              <div className="w-2 h-2 rounded-full bg-surface-variant"></div>
              <div className="w-6 h-2 rounded-full bg-primary transition-all duration-300"></div>
            </div>
            <button onClick={() => navigate('/signup')}
              className="w-full h-[56px] gradient-btn rounded-xl flex items-center justify-center font-label-md text-label-md text-on-primary shadow-[0_10px_30px_rgba(216,27,96,0.2)] hover:shadow-[0_10px_35px_rgba(216,27,96,0.3)] active:scale-[0.98] transition-all duration-200">
              Get Started
            </button>
            <div className="text-center mt-sm">
              <span className="font-body-md text-body-md text-on-surface-variant">Already have an account?</span>
              <button onClick={() => navigate('/login')} className="font-label-md text-label-md text-primary ml-1 hover:text-primary-container transition-colors">Login</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
