import React, { createContext, useContext, useEffect, useState } from 'react'
import {
  GoogleAuthProvider,
  FacebookAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  User as FirebaseUser,
  getAuth,
  OAuthProvider,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
} from 'firebase/auth'
import { authentication } from '@/lib/firebase'
import { COOKIE_STORAGE, DOMAIN } from '@/constants/env'
import { setCookie, deleteCookie } from '@/helpers/cookieUtils'
import { AuthContextType, UserData } from '@/types/user'
import { getUserInfoApi } from '@/api/user'
import { useToast } from '@/hooks/use-toast'
import useTranslationWithHTMLParser from '@/hooks/useTranslationWithHTMLParser'
import { I18N_NAMESPACES } from '@/constants/i18n'

// Create Auth Context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<FirebaseUser | null>(null)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [isOpenLoginModal, setIsOpenLoginModal] = useState<boolean>(false)
  const [isLoadingGoogleLogin, setIsLoadingGoogleLogin] =
    useState<boolean>(false)
  const [isLoadingFacebookLogin, setIsLoadingFacebookLogin] =
    useState<boolean>(false)
  const [isLoadingAppleLogin, setIsLoadingAppleLogin] = useState(false)
  const [isLoadingEmailLogin, setIsLoadingEmailLogin] = useState(false)
  const { toast } = useToast()
  const { t } = useTranslationWithHTMLParser(I18N_NAMESPACES.COMMON)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const loginWithGoogle = async (): Promise<void> => {
    setIsLoadingGoogleLogin(true)
    const provider = new GoogleAuthProvider()

    try {
      const result = await signInWithPopup(authentication, provider)
      if (result) {
        setUser(result.user)
        setIsAuthenticated(true)

        // @ts-ignore Lưu token vào cookie
        const token = result.user.accessToken
        setCookie(COOKIE_STORAGE.ACCESS_TOKEN, token, 30)

        // Lưu user vào localStorage
        localStorage.setItem(
          COOKIE_STORAGE.USER_INFO,
          JSON.stringify(result.user)
        )

        // Lấy thông tin user từ backend
        await getUserInfo(token)
      }
      setIsLoadingGoogleLogin(false)
    } catch (error) {
      toast({
        variant: 'destructive',
        title: t('login.failed'),
      })
      console.error('Google login error:', error)
      setIsLoadingGoogleLogin(false)
    }
  }

  const loginWithFacebook = async (): Promise<void> => {
    setIsLoadingFacebookLogin(true)
    const provider = new FacebookAuthProvider()

    try {
      const result = await signInWithPopup(authentication, provider)
      if (result) {
        setUser(result.user)
        setIsAuthenticated(true)
        // @ts-ignore Lưu token vào cookie
        const token = result.user.accessToken
        setCookie(COOKIE_STORAGE.ACCESS_TOKEN, token, 30)

        // Lưu user vào localStorage
        localStorage.setItem(
          COOKIE_STORAGE.USER_INFO,
          JSON.stringify(result.user)
        )

        // Lấy thông tin user từ backend
        await getUserInfo(token)
      }
      setIsLoadingFacebookLogin(false)
    } catch (error) {
      toast({
        variant: 'destructive',
        title: t('login.failed'),
      })
      console.error('Facebook login error:', error)
      setIsLoadingFacebookLogin(false)
    }
  }

  const loginWithApple = async () => {
    try {
      setIsLoadingAppleLogin(true)
      const auth = getAuth()
      const provider = new OAuthProvider('apple.com')
      provider.addScope('email')
      provider.addScope('name')

      const result = await signInWithPopup(auth, provider)
      const user = result.user

      // Lưu token vào cookie
      const token = await user.getIdToken()
      setCookie('token', token)

      // Lấy thông tin user từ backend
      await getUserInfo(token)

      // Lưu thông tin user vào state
      setUser(user)
      setIsAuthenticated(true)
    } catch (error) {
      toast({
        variant: 'destructive',
        title: t('login.failed'),
      })
      console.error('Apple login error:', error)
    } finally {
      setIsLoadingAppleLogin(false)
    }
  }

  const loginWithEmail = async (email: string) => {
    try {
      setIsLoadingEmailLogin(true)

      // Configure email link settings
      const actionCodeSettings = {
        url: DOMAIN as string,
        handleCodeInApp: true,
      }

      // Send sign-in link to email
      await sendSignInLinkToEmail(authentication, email, actionCodeSettings)

      // Save the email for later use
      window.localStorage.setItem('emailForSignIn', email)

      // Hiển thị thông báo thành công
      toast({
        title: t('login.emailSentTitle'),
        description: t('login.emailSentDescription', { email }),
      })
    } catch (error) {
      toast({
        variant: 'destructive',
        title: t('login.failed'),
        description: t('login.emailLoginError'),
      })
      console.error('Email login error:', error)
    } finally {
      setIsLoadingEmailLogin(false)
    }
  }

  // Kiểm tra và xử lý đăng nhập qua email link khi component mount
  useEffect(() => {
    // Kiểm tra xem URL hiện tại có phải là email link không
    if (isSignInWithEmailLink(authentication, window.location.href)) {
      // Lấy email đã lưu từ localStorage
      let email = window.localStorage.getItem('emailForSignIn')

      if (!email) {
        // Nếu không tìm thấy email trong localStorage, có thể yêu cầu người dùng nhập lại
        email = window.prompt('Please provide your email for confirmation')
      }

      if (email) {
        signInWithEmailLink(authentication, email, window.location.href)
          .then(async (result) => {
            // Xóa email khỏi localStorage
            window.localStorage.removeItem('emailForSignIn')

            // Lưu token và thông tin user
            const token = await result.user.getIdToken()
            setCookie(COOKIE_STORAGE.ACCESS_TOKEN, token, 30)
            localStorage.setItem(
              COOKIE_STORAGE.USER_INFO,
              JSON.stringify(result.user)
            )

            // Lấy thông tin user từ backend
            await getUserInfo(token)

            // Lưu thông tin user vào state
            setUser(result.user)
            setIsAuthenticated(true)
          })
          .catch((error) => {
            toast({
              variant: 'destructive',
              title: t('login.failed'),
              description: error.message,
            })
            console.error('Email link sign in error:', error)
          })
      }
    }
  }, [])

  const logout = async (): Promise<void> => {
    await signOut(authentication)
    setUser(null)
    setUserData(null)
    setIsAuthenticated(false)

    // Xóa dữ liệu trong localStorage và cookie
    localStorage.removeItem(COOKIE_STORAGE.USER_INFO)
    localStorage.removeItem('userData')
    deleteCookie(COOKIE_STORAGE.ACCESS_TOKEN)
  }

  const getUserInfo = async (token: string) => {
    setCookie(COOKIE_STORAGE.ACCESS_TOKEN, token, 30)
    const response = await getUserInfoApi()
    setLoading(false)

    const userData = response?.data?.user

    if (userData) {
      setUserData(userData)
      // Lưu userData vào localStorage
      localStorage.setItem('userData', JSON.stringify(userData))
      return userData
    }

    return null
  }

  const updateUserCredit = (remainingCredit: number) => {
    if (userData) {
      const updatedUserData = {
        ...userData,
        premium: {
          ...(userData.premium || {}),
          credit: remainingCredit,
        },
      }
      setUserData(updatedUserData)
      localStorage.setItem('userData', JSON.stringify(updatedUserData))
    }
  }

  // Theo dõi trạng thái đăng nhập từ Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      authentication,
      async (currentUser) => {
        if (currentUser) {
          setIsAuthenticated(true)
          setUser(currentUser)
          localStorage.setItem(
            COOKIE_STORAGE.USER_INFO,
            JSON.stringify(currentUser)
          )
          // @ts-ignore Lấy token
          const token = currentUser.accessToken
          await getUserInfo(token)
        } else {
          setIsAuthenticated(false)
          setUser(null)
          setUserData(null)
          setLoading(false)
        }
      }
    )

    // Kiểm tra và load dữ liệu từ localStorage khi khởi tạo
    const cachedUser = localStorage.getItem(COOKIE_STORAGE.USER_INFO)
    const cachedUserData = localStorage.getItem('userData')

    if (cachedUser && !user) {
      const parsedUser = JSON.parse(cachedUser)
      setUser(parsedUser)

      if (cachedUserData) {
        const parsedUserData = JSON.parse(cachedUserData)
        setUserData(parsedUserData)
      }
    }

    setLoading(false)

    return () => {
      unsubscribe()
    }
  }, [])

  // Các hàm xử lý modal đăng nhập
  const closeLoginModal = () => setIsOpenLoginModal(false)
  const openLoginModal = (redirectUrl?: string) => {
    setIsOpenLoginModal(true)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        userData,
        loading,
        isOpenLoginModal,
        isLoadingGoogleLogin,
        isLoadingFacebookLogin,
        isLoadingAppleLogin,
        isLoadingEmailLogin,
        isAuthenticated,
        loginWithGoogle,
        loginWithFacebook,
        loginWithApple,
        loginWithEmail,
        logout,
        closeLoginModal,
        openLoginModal,
        updateUserCredit,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
