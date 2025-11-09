import crypto from 'crypto'
import * as jose from 'jose'

export async function generateToken(): Promise<string> {
  try {
    const algorithm = { name: 'HMAC', hash: 'SHA-256' }
    const stringToUint8Array = (str: string) => {
      const bytes = new Uint8Array(str.length)
      for (let i = 0; i < str.length; i++) {
        bytes[i] = str.charCodeAt(i)
      }
      return bytes
    }

    const secretKey = stringToUint8Array(process.env.API_KEY || '')

    const key = await crypto.subtle.importKey(
      'raw',
      secretKey,
      algorithm,
      false,
      ['sign', 'verify']
    )

    const token = await new jose.SignJWT({
      platform: 'web',
      exp: Math.round(Date.now() / 1000) + 5 * 60,
    })
      .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
      .sign(key)

    return token
  } catch (error) {
    console.error('Token generation error:', error)
    throw new Error('Token generation failed')
  }
}

export function encryptData(data: any, key: Buffer, iv: Buffer) {
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv)
  let encrypted = cipher.update(JSON.stringify(data), 'utf8')
  encrypted = Buffer.concat([encrypted, cipher.final()])
  const tag = cipher.getAuthTag()
  return { encrypted, tag } // ✅ cả 2 là Buffer
}

export function generateEncryptionKeyBase64(): string {
  const key = crypto.randomBytes(32) // 32 bytes = 256-bit AES key
  return key.toString('base64') // Convert to Base64 for env usage
}
