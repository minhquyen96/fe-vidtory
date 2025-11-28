import React from 'react'
import { useAuth } from '@/context/AuthContext'
import { I18N_NAMESPACES } from '@/constants/i18n'
import { Button } from '@/components/ui/button'
import useTranslationWithHTMLParser from '@/hooks/useTranslationWithHTMLParser'
import shadowingAnimation from '/public/lottie/shadowing.json'
import { useEventTrackingHelpers, EVENT_NAMES } from '@/helpers/eventTracking'
import LogoIcon from '@/assets/icons/logo.svg'
import { CustomIcon } from '@/components/ui/custom-icon'

export const LoginModal: React.FC = () => {
  const {
    isOpenLoginModal,
    closeLoginModal,
    loginWithGoogle,
    loginWithFacebook,
    loginWithApple,
    loginWithEmail,
    isLoadingGoogleLogin,
    isLoadingFacebookLogin,
    isLoadingAppleLogin,
    isLoadingEmailLogin,
  } = useAuth()
  const { t } = useTranslationWithHTMLParser(I18N_NAMESPACES.COMMON)
  const { trackEvent } = useEventTrackingHelpers()

  const [email, setEmail] = React.useState('')
  const [emailLoginError, setEmailLoginError] = React.useState('')
  const [showEmailConfirmation, setShowEmailConfirmation] =
    React.useState(false)

  if (!isOpenLoginModal) return null

  const handleGoogleLogin = async () => {
    try {
      // Track login attempt
      trackEvent('AUTH', EVENT_NAMES.AUTH.LOGIN_ATTEMPT, {
        provider: 'google',
        modal_source: 'login_modal',
      })

      await loginWithGoogle()

      // Track login success
      trackEvent('AUTH', EVENT_NAMES.AUTH.LOGIN_SUCCESS, {
        provider: 'google',
        modal_source: 'login_modal',
      })

      closeLoginModal()
    } catch (error) {
      console.error('Login error:', error)

      // Track login failure
      trackEvent('AUTH', EVENT_NAMES.AUTH.LOGIN_FAILURE, {
        provider: 'google',
        modal_source: 'login_modal',
        error_message: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  }

  const handleFacebookLogin = async () => {
    try {
      // Track login attempt
      trackEvent('AUTH', EVENT_NAMES.AUTH.LOGIN_ATTEMPT, {
        provider: 'facebook',
        modal_source: 'login_modal',
      })

      await loginWithFacebook()

      // Track login success
      trackEvent('AUTH', EVENT_NAMES.AUTH.LOGIN_SUCCESS, {
        provider: 'facebook',
        modal_source: 'login_modal',
      })

      closeLoginModal()
    } catch (error) {
      console.error('Facebook login error:', error)

      // Track login failure
      trackEvent('AUTH', EVENT_NAMES.AUTH.LOGIN_FAILURE, {
        provider: 'facebook',
        modal_source: 'login_modal',
        error_message: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  }

  const handleAppleLogin = async () => {
    try {
      // Track login attempt
      trackEvent('AUTH', EVENT_NAMES.AUTH.LOGIN_ATTEMPT, {
        provider: 'apple',
        modal_source: 'login_modal',
      })

      await loginWithApple()

      // Track login success
      trackEvent('AUTH', EVENT_NAMES.AUTH.LOGIN_SUCCESS, {
        provider: 'apple',
        modal_source: 'login_modal',
      })

      closeLoginModal()
    } catch (error) {
      console.error('Apple login error:', error)

      // Track login failure
      trackEvent('AUTH', EVENT_NAMES.AUTH.LOGIN_FAILURE, {
        provider: 'apple',
        modal_source: 'login_modal',
        error_message: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  }

  const handleCloseModal = () => {
    trackEvent('UI', EVENT_NAMES.UI.MODAL_CLOSE, {
      modal_type: 'login_modal',
      close_method: 'backdrop_click',
    })
    closeLoginModal()
  }

  const handleCloseButtonClick = () => {
    trackEvent('UI', EVENT_NAMES.UI.MODAL_CLOSE, {
      modal_type: 'login_modal',
      close_method: 'close_button',
    })
    closeLoginModal()
  }

  const handleEmailLogin = async () => {
    if (!email) {
      setEmailLoginError(t('login.emailRequired'))
      return
    }

    try {
      setEmailLoginError('')

      // Track login attempt
      trackEvent('AUTH', EVENT_NAMES.AUTH.LOGIN_ATTEMPT, {
        provider: 'email',
        modal_source: 'login_modal',
      })

      // Call API to send magic link
      await loginWithEmail(email)

      // Show email confirmation screen
      setShowEmailConfirmation(true)

      // Track email sent
      trackEvent('AUTH', EVENT_NAMES.AUTH.LOGIN_SUCCESS, {
        provider: 'email',
        modal_source: 'login_modal',
        step: 'email_sent',
      })
    } catch (error) {
      console.error('Email login error:', error)

      setEmailLoginError(t('login.emailLoginError'))

      // Track login failure
      trackEvent('AUTH', EVENT_NAMES.AUTH.LOGIN_FAILURE, {
        provider: 'email',
        modal_source: 'login_modal',
        error_message: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleCloseModal}
      />

      {/* Modal */}
      <div className="relative bg-background rounded-lg shadow-xl w-full max-w-4xl mx-4 flex overflow-hidden">
        {/* Left Column: Form */}
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
          {/* Close button */}
          <button
            onClick={handleCloseButtonClick}
            className="absolute top-3 right-3 text-muted-foreground hover:text-foreground md:hidden z-40"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-x"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>

          {/* Content */}
          {showEmailConfirmation ? (
            <div>
              {/* Back button */}
              <div className="flex items-center gap-2 mb-8">
                <Button
                  variant="ghost"
                  className="h-auto hover:bg-primary"
                  onClick={() => setShowEmailConfirmation(false)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m15 18-6-6 6-6" />
                  </svg>
                  <span className="font-medium">{t('login.back')}</span>
                </Button>
              </div>

              {/* Email confirmation content */}
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-4">
                  {t('login.emailSentTitle')}
                </h2>
                <p className="text-muted-foreground mb-8">
                  {t('login.emailSentDescription', { email })}
                </p>
                <Button
                  className="w-full py-6"
                  variant="default"
                  onClick={handleEmailLogin}
                  disabled={isLoadingEmailLogin}
                >
                  {isLoadingEmailLogin ? (
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  ) : null}
                  <span>{t('login.resendEmail')}</span>
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="text-center mb-6">
                <div className="flex gap-2 justify-center">
                  <CustomIcon icon={LogoIcon} className="w-32 h-10" />
                </div>
              </div>

              {/* Login buttons */}
              <div className="space-y-4">
                <Button
                  onClick={handleGoogleLogin}
                  disabled={isLoadingGoogleLogin}
                  className="w-full py-6 flex items-center justify-center gap-3 bg-white text-black border"
                  variant="outline"
                >
                  {isLoadingGoogleLogin ? (
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-black"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      className="h-6 w-6"
                    >
                      <path
                        fill="#EA4335"
                        d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.27 0 3.198 2.698 1.24 6.65l4.026 3.115Z"
                      />
                      <path
                        fill="#34A853"
                        d="M16.04 18.013c-1.09.703-2.474 1.078-4.04 1.078a7.077 7.077 0 0 1-6.723-4.823l-4.04 3.067A11.965 11.965 0 0 0 12 24c2.933 0 5.735-1.043 7.834-3l-3.793-2.987Z"
                      />
                      <path
                        fill="#4A90E2"
                        d="M19.834 21c2.195-2.048 3.62-5.096 3.62-9 0-.71-.109-1.473-.272-2.182H12v4.637h6.436c-.317 1.559-1.17 2.766-2.395 3.558L19.834 21Z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.277 14.268A7.12 7.12 0 0 1 4.909 12c0-.782.125-1.533.357-2.235L1.24 6.65A11.934 11.934 0 0 0 0 12c0 1.92.445 3.73 1.237 5.335l4.04-3.067Z"
                      />
                    </svg>
                  )}
                  <span>{t('login.continueWithGoogle')}</span>
                </Button>

                {/*<Button*/}
                {/*  onClick={handleAppleLogin}*/}
                {/*  disabled={isLoadingAppleLogin}*/}
                {/*  className="w-full py-6 flex items-center justify-center gap-3 bg-black text-white border-black hover:bg-black/90"*/}
                {/*  variant="outline"*/}
                {/*>*/}
                {/*  {isLoadingAppleLogin ? (*/}
                {/*    <svg*/}
                {/*      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"*/}
                {/*      xmlns="http://www.w3.org/2000/svg"*/}
                {/*      fill="none"*/}
                {/*      viewBox="0 0 24 24"*/}
                {/*    >*/}
                {/*      <circle*/}
                {/*        className="opacity-25"*/}
                {/*        cx="12"*/}
                {/*        cy="12"*/}
                {/*        r="10"*/}
                {/*        stroke="currentColor"*/}
                {/*        strokeWidth="4"*/}
                {/*      ></circle>*/}
                {/*      <path*/}
                {/*        className="opacity-75"*/}
                {/*        fill="currentColor"*/}
                {/*        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"*/}
                {/*      ></path>*/}
                {/*    </svg>*/}
                {/*  ) : (*/}
                {/*    <svg*/}
                {/*      xmlns="http://www.w3.org/2000/svg"*/}
                {/*      width="24"*/}
                {/*      height="24"*/}
                {/*      viewBox="0 0 24 24"*/}
                {/*      fill="currentColor"*/}
                {/*      className="h-6 w-6"*/}
                {/*    >*/}
                {/*      <path d="M17.05 20.28c-.98.95-2.05.88-3.08.38-1.07-.52-2.04-.53-3.17 0-1.44.69-2.2.53-3.01-.38C4.27 15.95 4.99 9.35 9.08 9.12c1.24.05 2.14.84 3.14.84 1 0 1.84-.84 3.11-.84 1.75.06 3.08.94 3.96 2.64-3.49 2.11-2.9 7.2.76 8.52ZM15.84 6.41c.89-1.14.77-2.76-.07-3.98-.89 1.03-1.07 2.67-.1 3.98Z" />*/}
                {/*    </svg>*/}
                {/*  )}*/}
                {/*  <span>{t('login.continueWithApple')}</span>*/}
                {/*</Button>*/}

                {/*Divider*/}
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-muted"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      {t('login.orContinueWith')}
                    </span>
                  </div>
                </div>

                {/*Email login form*/}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <input
                      type="email"
                      placeholder={t('login.emailPlaceholder')}
                      className={`w-full px-3 py-2 border rounded-md text-sm text-foreground bg-background ${
                        emailLoginError ? 'border-destructive' : ''
                      }`}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleEmailLogin()}
                    />
                    {emailLoginError && (
                      <p className="text-xs text-destructive">
                        {emailLoginError}
                      </p>
                    )}
                  </div>
                  <Button
                    className="w-full py-6"
                    variant="default"
                    onClick={handleEmailLogin}
                    disabled={isLoadingEmailLogin}
                  >
                    {isLoadingEmailLogin ? (
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    ) : null}
                    <span>{t('login.continueWithEmail')}</span>
                  </Button>
                </div>

                {/* Terms */}
                <p className="mt-6 text-sm text-center text-muted-foreground">
                  {t('login.termsText')}
                </p>
              </div>
            </>
          )}
        </div>
        {/* Right Column: Sample Image */}
        <div className="hidden md:flex md:w-1/2 relative items-center justify-center p-8 overflow-hidden bg-gradient-to-br from-primary/20 via-secondary/20 to-background">
          <div className="relative w-full h-full flex flex-col items-center justify-center space-y-6">
            {/* Decorative gradient circles */}
            <div className="absolute top-10 right-10 w-32 h-32 bg-primary/30 rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 left-10 w-40 h-40 bg-secondary/30 rounded-full blur-3xl"></div>

            {/* Content */}
            <div className="relative z-10 text-center space-y-4 max-w-sm">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/20 backdrop-blur-sm mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary"
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-foreground">
                {t('login.modalRight.title')}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {t('login.modalRight.description')}
              </p>

              {/* Feature highlights */}
              <div className="grid grid-cols-2 gap-3 mt-6">
                <div className="flex items-center gap-2 text-xs text-foreground/80">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                  <span>{t('login.modalRight.feature1')}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-foreground/80">
                  <div className="w-1.5 h-1.5 rounded-full bg-secondary"></div>
                  <span>{t('login.modalRight.feature2')}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-foreground/80">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                  <span>{t('login.modalRight.feature3')}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-foreground/80">
                  <div className="w-1.5 h-1.5 rounded-full bg-secondary"></div>
                  <span>{t('login.modalRight.feature4')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
