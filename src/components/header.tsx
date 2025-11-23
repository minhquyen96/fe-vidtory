import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { Icons } from '@/components/ui/icons'
import { cn } from '@/lib/utils'
import LogoIcon from '@/assets/icons/logo.svg'
import { CustomIcon } from '@/components/ui/custom-icon'
import { useAuth } from '@/context/AuthContext'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

export function Header() {
  const { openLoginModal, user, userData, logout } = useAuth()
  const router = useRouter()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isProductMenuOpen, setIsProductMenuOpen] = useState(false)
  const [isUseCasesMenuOpen, setIsUseCasesMenuOpen] = useState(false)
  const productMenuTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const useCasesMenuTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (productMenuTimeoutRef.current) {
        clearTimeout(productMenuTimeoutRef.current)
      }
      if (useCasesMenuTimeoutRef.current) {
        clearTimeout(useCasesMenuTimeoutRef.current)
      }
    }
  }, [])

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all',
        isScrolled && 'shadow-sm'
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center gap-8">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <CustomIcon icon={LogoIcon} className="w-32 h-10" />
            </Link>
          </div>

          {/*Navigation Menu - Desktop*/}
          {/*<nav className="hidden sm+:flex items-center space-x-1 flex-1">*/}
          {/*  /!* Products Dropdown *!/*/}
          {/*  <div*/}
          {/*    className="relative"*/}
          {/*    onMouseEnter={() => {*/}
          {/*      if (productMenuTimeoutRef.current) {*/}
          {/*        clearTimeout(productMenuTimeoutRef.current)*/}
          {/*        productMenuTimeoutRef.current = null*/}
          {/*      }*/}
          {/*      setIsProductMenuOpen(true)*/}
          {/*    }}*/}
          {/*    onMouseLeave={() => {*/}
          {/*      productMenuTimeoutRef.current = setTimeout(() => {*/}
          {/*        setIsProductMenuOpen(false)*/}
          {/*      }, 150)*/}
          {/*    }}*/}
          {/*  >*/}
          {/*    <DropdownMenu*/}
          {/*      open={isProductMenuOpen}*/}
          {/*      onOpenChange={setIsProductMenuOpen}*/}
          {/*    >*/}
          {/*      <DropdownMenuTrigger asChild>*/}
          {/*        <Button*/}
          {/*          variant="ghost"*/}
          {/*          className="text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-primary/10"*/}
          {/*        >*/}
          {/*          Product*/}
          {/*          <Icons.chevronDown className="ml-1 h-4 w-4" />*/}
          {/*        </Button>*/}
          {/*      </DropdownMenuTrigger>*/}
          {/*      <DropdownMenuContent*/}
          {/*        align="start"*/}
          {/*        className="w-[600px] p-0 rounded-lg"*/}
          {/*        onMouseEnter={() => {*/}
          {/*          if (productMenuTimeoutRef.current) {*/}
          {/*            clearTimeout(productMenuTimeoutRef.current)*/}
          {/*            productMenuTimeoutRef.current = null*/}
          {/*          }*/}
          {/*          setIsProductMenuOpen(true)*/}
          {/*        }}*/}
          {/*        onMouseLeave={() => {*/}
          {/*          productMenuTimeoutRef.current = setTimeout(() => {*/}
          {/*            setIsProductMenuOpen(false)*/}
          {/*          }, 150)*/}
          {/*        }}*/}
          {/*      >*/}
          {/*        <div className="grid grid-cols-2 gap-0">*/}
          {/*          /!* Left Panel: PRODUCT *!/*/}
          {/*          <div className="p-6 border-r bg-muted/30">*/}
          {/*            <DropdownMenuLabel className="px-0 mb-4 text-xs font-semibold uppercase tracking-wide">*/}
          {/*              PRODUCT*/}
          {/*            </DropdownMenuLabel>*/}
          {/*            <div className="space-y-2">*/}
          {/*              <DropdownMenuItem asChild>*/}
          {/*                <Link*/}
          {/*                  href="/"*/}
          {/*                  className="px-3 py-2.5 rounded-md flex items-center gap-3 w-full hover:bg-primary/20 hover:text-foreground"*/}
          {/*                >*/}
          {/*                  <div className="w-8 h-8 rounded-md bg-purple-500/20 flex items-center justify-center flex-shrink-0">*/}
          {/*                    <Icons.play className="w-4 h-4 text-purple-600" />*/}
          {/*                  </div>*/}
          {/*                  <span className="flex-1 text-sm">Create</span>*/}
          {/*                  <Icons.chevronRight className="w-4 h-4 text-foreground/40" />*/}
          {/*                </Link>*/}
          {/*              </DropdownMenuItem>*/}
          {/*              <DropdownMenuItem asChild>*/}
          {/*                <Link*/}
          {/*                  href="/"*/}
          {/*                  className="px-3 py-2.5 rounded-md flex items-center gap-3 w-full hover:bg-primary/20 hover:text-foreground"*/}
          {/*                >*/}
          {/*                  <div className="w-8 h-8 rounded-md bg-purple-500/20 flex items-center justify-center flex-shrink-0">*/}
          {/*                    <Icons.edit className="w-4 h-4 text-purple-600" />*/}
          {/*                  </div>*/}
          {/*                  <span className="flex-1 text-sm">Edit</span>*/}
          {/*                  <Icons.chevronRight className="w-4 h-4 text-foreground/40" />*/}
          {/*                </Link>*/}
          {/*              </DropdownMenuItem>*/}
          {/*              <DropdownMenuItem asChild>*/}
          {/*                <Link*/}
          {/*                  href="/"*/}
          {/*                  className="px-3 py-2.5 rounded-md flex items-center gap-3 w-full hover:bg-primary/20 hover:text-foreground"*/}
          {/*                >*/}
          {/*                  <div className="w-8 h-8 rounded-md bg-green-500/20 flex items-center justify-center flex-shrink-0">*/}
          {/*                    <Icons.play className="w-4 h-4 text-green-600" />*/}
          {/*                  </div>*/}
          {/*                  <span className="flex-1 text-sm">Publish</span>*/}
          {/*                  <Icons.chevronRight className="w-4 h-4 text-foreground/40" />*/}
          {/*                </Link>*/}
          {/*              </DropdownMenuItem>*/}
          {/*            </div>*/}
          {/*          </div>*/}

          {/*          /!* Right Panel: Sample items *!/*/}
          {/*          <div className="p-6">*/}
          {/*            <DropdownMenuLabel className="px-0 mb-3 text-xs font-semibold uppercase tracking-wide">*/}
          {/*              POPULAR*/}
          {/*            </DropdownMenuLabel>*/}
          {/*            <div className="space-y-1">*/}
          {/*              <DropdownMenuItem asChild>*/}
          {/*                <Link*/}
          {/*                  href="/"*/}
          {/*                  className="px-3 py-2.5 text-sm hover:bg-primary/20 hover:text-foreground"*/}
          {/*                >*/}
          {/*                  Video Story Creator*/}
          {/*                </Link>*/}
          {/*              </DropdownMenuItem>*/}
          {/*              <DropdownMenuItem asChild>*/}
          {/*                <Link*/}
          {/*                  href="/"*/}
          {/*                  className="px-3 py-2.5 text-sm hover:bg-primary/20 hover:text-foreground"*/}
          {/*                >*/}
          {/*                  Niche Templates*/}
          {/*                </Link>*/}
          {/*              </DropdownMenuItem>*/}
          {/*              <DropdownMenuItem asChild>*/}
          {/*                <Link*/}
          {/*                  href="/"*/}
          {/*                  className="px-3 py-2.5 text-sm hover:bg-primary/20 hover:text-foreground"*/}
          {/*                >*/}
          {/*                  Video Editor*/}
          {/*                </Link>*/}
          {/*              </DropdownMenuItem>*/}
          {/*            </div>*/}
          {/*          </div>*/}
          {/*        </div>*/}
          {/*      </DropdownMenuContent>*/}
          {/*    </DropdownMenu>*/}
          {/*  </div>*/}

          {/*  /!* Use Cases Dropdown *!/*/}
          {/*  <div*/}
          {/*    className="relative"*/}
          {/*    onMouseEnter={() => {*/}
          {/*      if (useCasesMenuTimeoutRef.current) {*/}
          {/*        clearTimeout(useCasesMenuTimeoutRef.current)*/}
          {/*        useCasesMenuTimeoutRef.current = null*/}
          {/*      }*/}
          {/*      setIsUseCasesMenuOpen(true)*/}
          {/*    }}*/}
          {/*    onMouseLeave={() => {*/}
          {/*      useCasesMenuTimeoutRef.current = setTimeout(() => {*/}
          {/*        setIsUseCasesMenuOpen(false)*/}
          {/*      }, 150)*/}
          {/*    }}*/}
          {/*  >*/}
          {/*    <DropdownMenu*/}
          {/*      open={isUseCasesMenuOpen}*/}
          {/*      onOpenChange={setIsUseCasesMenuOpen}*/}
          {/*    >*/}
          {/*      <DropdownMenuTrigger asChild>*/}
          {/*        <Button*/}
          {/*          variant="ghost"*/}
          {/*          className="text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-primary/10"*/}
          {/*        >*/}
          {/*          Use Cases*/}
          {/*          <Icons.chevronDown className="ml-1 h-4 w-4" />*/}
          {/*        </Button>*/}
          {/*      </DropdownMenuTrigger>*/}
          {/*      <DropdownMenuContent*/}
          {/*        align="start"*/}
          {/*        className="w-[500px] p-0 rounded-lg"*/}
          {/*        onMouseEnter={() => {*/}
          {/*          if (useCasesMenuTimeoutRef.current) {*/}
          {/*            clearTimeout(useCasesMenuTimeoutRef.current)*/}
          {/*            useCasesMenuTimeoutRef.current = null*/}
          {/*          }*/}
          {/*          setIsUseCasesMenuOpen(true)*/}
          {/*        }}*/}
          {/*        onMouseLeave={() => {*/}
          {/*          useCasesMenuTimeoutRef.current = setTimeout(() => {*/}
          {/*            setIsUseCasesMenuOpen(false)*/}
          {/*          }, 150)*/}
          {/*        }}*/}
          {/*      >*/}
          {/*        <div className="grid grid-cols-2 gap-0">*/}
          {/*          /!* Column 1: USE CASES *!/*/}
          {/*          <div className="p-6 border-r">*/}
          {/*            <DropdownMenuLabel className="px-0 mb-4 text-xs font-semibold uppercase tracking-wide">*/}
          {/*              USE CASES*/}
          {/*            </DropdownMenuLabel>*/}
          {/*            <div className="space-y-2">*/}
          {/*              <DropdownMenuItem asChild>*/}
          {/*                <Link*/}
          {/*                  href="/"*/}
          {/*                  className="px-3 py-2.5 rounded-md flex items-center gap-3 w-full hover:bg-primary/20 hover:text-foreground"*/}
          {/*                >*/}
          {/*                  <div className="w-8 h-8 rounded-md bg-orange-500/20 flex items-center justify-center flex-shrink-0">*/}
          {/*                    <Icons.megaphone className="w-4 h-4 text-orange-600" />*/}
          {/*                  </div>*/}
          {/*                  <span className="flex-1 text-sm">Marketing</span>*/}
          {/*                  <Icons.chevronRight className="w-4 h-4 text-foreground/40" />*/}
          {/*                </Link>*/}
          {/*              </DropdownMenuItem>*/}
          {/*              <DropdownMenuItem asChild>*/}
          {/*                <Link*/}
          {/*                  href="/"*/}
          {/*                  className="px-3 py-2.5 rounded-md flex items-center gap-3 w-full hover:bg-primary/20 hover:text-foreground"*/}
          {/*                >*/}
          {/*                  <div className="w-8 h-8 rounded-md bg-blue-500/20 flex items-center justify-center flex-shrink-0">*/}
          {/*                    <Icons.graduationCap className="w-4 h-4 text-blue-600" />*/}
          {/*                  </div>*/}
          {/*                  <span className="flex-1 text-sm">Training</span>*/}
          {/*                  <Icons.chevronRight className="w-4 h-4 text-foreground/40" />*/}
          {/*                </Link>*/}
          {/*              </DropdownMenuItem>*/}
          {/*              <DropdownMenuItem asChild>*/}
          {/*                <Link*/}
          {/*                  href="/"*/}
          {/*                  className="px-3 py-2.5 rounded-md flex items-center gap-3 w-full hover:bg-primary/20 hover:text-foreground"*/}
          {/*                >*/}
          {/*                  <div className="w-8 h-8 rounded-md bg-green-500/20 flex items-center justify-center flex-shrink-0">*/}
          {/*                    <Icons.dollarSign className="w-4 h-4 text-green-600" />*/}
          {/*                  </div>*/}
          {/*                  <span className="flex-1 text-sm">Sales</span>*/}
          {/*                  <Icons.chevronRight className="w-4 h-4 text-foreground/40" />*/}
          {/*                </Link>*/}
          {/*              </DropdownMenuItem>*/}
          {/*              <DropdownMenuItem asChild>*/}
          {/*                <Link*/}
          {/*                  href="/"*/}
          {/*                  className="px-3 py-2.5 rounded-md flex items-center gap-3 w-full hover:bg-primary/20 hover:text-foreground"*/}
          {/*                >*/}
          {/*                  <div className="w-8 h-8 rounded-md bg-pink-500/20 flex items-center justify-center flex-shrink-0">*/}
          {/*                    <Icons.newspaper className="w-4 h-4 text-pink-600" />*/}
          {/*                  </div>*/}
          {/*                  <span className="flex-1 text-sm">*/}
          {/*                    Media & Publishing*/}
          {/*                  </span>*/}
          {/*                  <Icons.chevronRight className="w-4 h-4 text-foreground/40" />*/}
          {/*                </Link>*/}
          {/*              </DropdownMenuItem>*/}
          {/*              <DropdownMenuItem asChild>*/}
          {/*                <Link*/}
          {/*                  href="/"*/}
          {/*                  className="px-3 py-2.5 rounded-md flex items-center gap-3 w-full hover:bg-primary/20 hover:text-foreground"*/}
          {/*                >*/}
          {/*                  <div className="w-8 h-8 rounded-md bg-cyan-500/20 flex items-center justify-center flex-shrink-0">*/}
          {/*                    <Icons.users className="w-4 h-4 text-cyan-600" />*/}
          {/*                  </div>*/}
          {/*                  <span className="flex-1 text-sm">*/}
          {/*                    Internal Communications*/}
          {/*                  </span>*/}
          {/*                  <Icons.chevronRight className="w-4 h-4 text-foreground/40" />*/}
          {/*                </Link>*/}
          {/*              </DropdownMenuItem>*/}
          {/*            </div>*/}
          {/*          </div>*/}

          {/*          /!* Column 2: BY COMPANY SIZE *!/*/}
          {/*          <div className="p-6">*/}
          {/*            <DropdownMenuLabel className="px-0 mb-4 text-xs font-semibold uppercase tracking-wide">*/}
          {/*              BY COMPANY SIZE*/}
          {/*            </DropdownMenuLabel>*/}
          {/*            <div className="space-y-2">*/}
          {/*              <DropdownMenuItem asChild>*/}
          {/*                <Link*/}
          {/*                  href="/"*/}
          {/*                  className="px-3 py-2.5 rounded-md flex items-center gap-3 w-full hover:bg-primary/20 hover:text-foreground"*/}
          {/*                >*/}
          {/*                  <div className="w-8 h-8 rounded-md bg-green-500/20 flex items-center justify-center flex-shrink-0">*/}
          {/*                    <Icons.building2 className="w-4 h-4 text-green-600" />*/}
          {/*                  </div>*/}
          {/*                  <span className="flex-1 text-sm">Enterprise</span>*/}
          {/*                  <Icons.chevronRight className="w-4 h-4 text-foreground/40" />*/}
          {/*                </Link>*/}
          {/*              </DropdownMenuItem>*/}
          {/*            </div>*/}
          {/*            <div className="mt-6 pt-6 border-t">*/}
          {/*              <DropdownMenuItem asChild>*/}
          {/*                <Link*/}
          {/*                  href="/"*/}
          {/*                  className="px-3 py-2.5 text-sm text-foreground/60 hover:bg-primary/20 hover:text-foreground"*/}
          {/*                >*/}
          {/*                  Other use cases*/}
          {/*                </Link>*/}
          {/*              </DropdownMenuItem>*/}
          {/*            </div>*/}
          {/*          </div>*/}
          {/*        </div>*/}
          {/*      </DropdownMenuContent>*/}
          {/*    </DropdownMenu>*/}
          {/*  </div>*/}
          {/*</nav>*/}

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2 ml-auto">
            {/* User Avatar or Login Button - Desktop */}
            {user ? (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hidden sm+:inline-flex rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={userData?.photoURL || user.photoURL || undefined}
                        alt={
                          userData?.displayName ||
                          userData?.name ||
                          user.displayName ||
                          'User'
                        }
                      />
                      <AvatarFallback className="bg-primary/20 text-foreground">
                        {(
                          userData?.displayName ||
                          userData?.name ||
                          user.displayName ||
                          user.email ||
                          'U'
                        )
                          .charAt(0)
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-56 p-2">
                  <div className="flex flex-col space-y-1">
                    <div className="px-3 py-2">
                      <p className="text-sm font-medium">
                        {userData?.displayName ||
                          userData?.name ||
                          user.displayName ||
                          'User'}
                      </p>
                      <p className="text-xs text-foreground/60 truncate">
                        {user.email}
                      </p>
                    </div>
                    <div className="border-t" />
                    <Button
                      variant="ghost"
                      className="justify-start w-full"
                      onClick={() => {
                        logout()
                      }}
                    >
                      <Icons.logOut className="mr-2 h-4 w-4" />
                      <span>Logout</span>
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            ) : (
              <Button
                variant="ghost"
                className="hidden sm+:inline-flex text-sm font-medium"
                onClick={() => openLoginModal()}
              >
                Login
              </Button>
            )}

            {/* Mobile Menu */}
            <Drawer open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <DrawerTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="sm+:hidden"
                  aria-label="Toggle menu"
                >
                  <Icons.menu className="h-5 w-5" />
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>Menu</DrawerTitle>
                </DrawerHeader>
                <div className="flex flex-col p-4 space-y-6 max-h-[80vh] overflow-y-auto">
                  {/* Products Section */}
                  <div>
                    <h3 className="text-sm font-semibold mb-3">Product</h3>

                    <div className="space-y-4">
                      <div>
                        <h4 className="text-xs font-semibold text-foreground/60 mb-2">
                          Create
                        </h4>
                        <div className="flex flex-col space-y-2">
                          <Link
                            href="/"
                            className="text-sm text-foreground/80 hover:text-foreground"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            Video Story Creator
                          </Link>
                          <Link
                            href="/"
                            className="text-sm text-foreground/80 hover:text-foreground"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            Niche Templates
                          </Link>
                          <Link
                            href="/"
                            className="text-sm text-foreground/80 hover:text-foreground"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            Script Generator
                          </Link>
                          <Link
                            href="/"
                            className="text-sm text-foreground/80 hover:text-foreground"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            AI Avatars
                          </Link>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-xs font-semibold text-foreground/60 mb-2">
                          Edit
                        </h4>
                        <div className="flex flex-col space-y-2">
                          <Link
                            href="/"
                            className="text-sm text-foreground/80 hover:text-foreground"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            Video Editor
                          </Link>
                          <Link
                            href="/"
                            className="text-sm text-foreground/80 hover:text-foreground"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            Translations
                          </Link>
                          <Link
                            href="/"
                            className="text-sm text-foreground/80 hover:text-foreground"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            Subtitles
                          </Link>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-xs font-semibold text-foreground/60 mb-2">
                          Publish
                        </h4>
                        <div className="flex flex-col space-y-2">
                          <Link
                            href="/"
                            className="text-sm text-foreground/80 hover:text-foreground"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            Video Player
                          </Link>
                          <Link
                            href="/"
                            className="text-sm text-foreground/80 hover:text-foreground"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            Video Hosting
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Use Cases Section */}
                  <div>
                    <h3 className="text-sm font-semibold mb-3">Use Cases</h3>
                    <div className="flex flex-col space-y-2">
                      <Link
                        href="/"
                        className="text-sm text-foreground/80 hover:text-foreground"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Marketing
                      </Link>
                      <Link
                        href="/"
                        className="text-sm text-foreground/80 hover:text-foreground"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Training
                      </Link>
                      <Link
                        href="/"
                        className="text-sm text-foreground/80 hover:text-foreground"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Sales
                      </Link>
                      <Link
                        href="/"
                        className="text-sm text-foreground/80 hover:text-foreground"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Media & Publishing
                      </Link>
                      <Link
                        href="/"
                        className="text-sm text-foreground/80 hover:text-foreground"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Internal Communications
                      </Link>
                    </div>
                    <div className="mt-4 pt-4 border-t">
                      <h4 className="text-xs font-semibold text-foreground/60 mb-2">
                        BY COMPANY SIZE
                      </h4>
                      <Link
                        href="/"
                        className="text-sm text-foreground/80 hover:text-foreground"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Enterprise
                      </Link>
                    </div>
                  </div>

                  {/* Login Button - Mobile */}
                  {!user && (
                    <div className="pt-4 border-t">
                      <Button
                        variant="default"
                        className="w-full"
                        onClick={() => openLoginModal()}
                      >
                        Login
                      </Button>
                    </div>
                  )}
                </div>
              </DrawerContent>
            </Drawer>
          </div>
        </div>
      </div>
    </header>
  )
}
