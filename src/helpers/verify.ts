import * as jose from 'jose'

export async function handleKInfo(code: string): Promise<string> {
  try {
    const algorithm = { name: 'HMAC', hash: 'SHA-256' }
    const stringToUint8Array = (str: string) => {
      const bytes = new Uint8Array(str.length)
      for (let i = 0; i < str.length; i++) {
        bytes[i] = str.charCodeAt(i)
      }
      return bytes
    }
    const secretKey = stringToUint8Array(code || '')

    const key = await crypto.subtle.importKey(
      'raw',
      secretKey,
      algorithm,
      false,
      ['sign', 'verify']
    )

    const token = await new jose.SignJWT({
      platform: 'web',
      exp: Math.round(Date.now() / 1000) + 60,
    })
      .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
      .sign(key)

    return token
  } catch (error) {
    console.error('Token generation error:', error)
    throw new Error('Token generation failed')
  }
}

export async function handleProtect(payload: any): Promise<string> {
  try {
    const algorithm = { name: 'HMAC', hash: 'SHA-256' }
    const stringToUint8Array = (str: string) => {
      const bytes = new Uint8Array(str.length)
      for (let i = 0; i < str.length; i++) {
        bytes[i] = str.charCodeAt(i)
      }
      return bytes
    }
    const secretKey = stringToUint8Array(
      process.env.NEXT_PUBLIC_ENCRYPTION_KEY || ''
    )

    const key = await crypto.subtle.importKey(
      'raw',
      secretKey,
      algorithm,
      false,
      ['sign', 'verify']
    )

    const token = await new jose.SignJWT({
      ...payload,
      platform: 'web',
      exp: Math.round(Date.now() / 1000) + 2 * 60,
    })
      .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
      .sign(key)

    return token
  } catch (error) {
    console.error('Token generation error:', error)
    throw new Error('Token generation failed')
  }
}
