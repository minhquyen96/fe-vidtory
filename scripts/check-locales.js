const fs = require('fs')
const path = require('path')

const LOCALES_DIR = path.join(__dirname, '..', 'public', 'locales')
const REFERENCE_LANG = 'en'

/**
 * Get all keys from a JSON object recursively
 * @param {Object} obj - The JSON object
 * @param {string} prefix - Current key path prefix
 * @returns {Array} Array of all nested key paths
 */
function getAllKeys(obj, prefix = '') {
  const keys = []

  for (const key in obj) {
    const fullKey = prefix ? `${prefix}.${key}` : key
    keys.push(fullKey)

    if (
      typeof obj[key] === 'object' &&
      obj[key] !== null &&
      !Array.isArray(obj[key])
    ) {
      keys.push(...getAllKeys(obj[key], fullKey))
    }
  }

  return keys
}

/**
 * Compare two JSON structures and find differences
 * @param {Object} referenceJson - Reference JSON structure
 * @param {Object} targetJson - Target JSON structure to compare
 * @param {string} fileName - Name of the file being compared
 * @returns {Object} Comparison result with missing and extra keys
 */
function compareJsonStructures(referenceJson, targetJson, fileName) {
  const referenceKeys = getAllKeys(referenceJson)
  const targetKeys = getAllKeys(targetJson)

  const missingKeys = referenceKeys.filter((key) => !targetKeys.includes(key))
  const extraKeys = targetKeys.filter((key) => !referenceKeys.includes(key))

  return {
    fileName,
    missingKeys,
    extraKeys,
    referenceKeyCount: referenceKeys.length,
    targetKeyCount: targetKeys.length,
    isIdentical: missingKeys.length === 0 && extraKeys.length === 0,
  }
}

/**
 * Get all JSON files in a directory
 * @param {string} dirPath - Directory path
 * @returns {Array} Array of JSON file names
 */
function getJsonFiles(dirPath) {
  try {
    return fs
      .readdirSync(dirPath)
      .filter((file) => file.endsWith('.json'))
      .sort()
  } catch (error) {
    return []
  }
}

/**
 * Load and parse a JSON file
 * @param {string} filePath - Path to the JSON file
 * @returns {Object|null} Parsed JSON object or null if error
 */
function loadJsonFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8')
    return JSON.parse(content)
  } catch (error) {
    console.error(`Error loading ${filePath}:`, error.message)
    return null
  }
}

/**
 * Main function to analyze all locale folders
 */
function analyzeLocales() {
  console.log('🔍 Analyzing locale folders...\n')

  // Get reference files from English folder
  const referencePath = path.join(LOCALES_DIR, REFERENCE_LANG)
  const referenceFiles = getJsonFiles(referencePath)

  if (referenceFiles.length === 0) {
    console.error(
      `❌ No JSON files found in reference language folder: ${referencePath}`
    )
    return
  }

  console.log(
    `📋 Reference language (${REFERENCE_LANG}) has ${referenceFiles.length} files:`
  )
  console.log(`   ${referenceFiles.join(', ')}\n`)

  // Get all language folders
  const allFolders = fs
    .readdirSync(LOCALES_DIR, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name)
    .filter((name) => name !== REFERENCE_LANG)
    .sort()

  console.log(
    `🌍 Found ${allFolders.length} other language folders: ${allFolders.join(', ')}\n`
  )

  // Store results for final report
  const finalReport = {
    referenceLanguage: REFERENCE_LANG,
    referenceFileCount: referenceFiles.length,
    totalLanguages: allFolders.length,
    languageResults: [],
    summary: {
      perfectLanguages: 0,
      languagesWithIssues: 0,
      totalMissingFiles: 0,
      totalExtraFiles: 0,
      totalMissingKeys: 0,
      totalExtraKeys: 0,
    },
  }

  // Analyze each language folder
  allFolders.forEach((langCode) => {
    console.log(`\n${'='.repeat(60)}`)
    console.log(`🏳️  Analyzing ${langCode.toUpperCase()} locale`)
    console.log(`${'='.repeat(60)}`)

    const langPath = path.join(LOCALES_DIR, langCode)
    const langFiles = getJsonFiles(langPath)

    // Initialize language result object
    const languageResult = {
      languageCode: langCode,
      fileCount: langFiles.length,
      missingFiles: [],
      extraFiles: [],
      structureResults: [],
      totalIssues: 0,
      isPerfect: true,
    }

    // Check file count and names
    console.log(`\n📁 File comparison:`)
    console.log(
      `   Reference (${REFERENCE_LANG}): ${referenceFiles.length} files`
    )
    console.log(`   Target (${langCode}): ${langFiles.length} files`)

    if (referenceFiles.length !== langFiles.length) {
      console.log(`   ⚠️  Different file counts!`)
      languageResult.isPerfect = false
    } else {
      console.log(`   ✅ Same file count`)
    }

    // Check for missing files
    const missingFiles = referenceFiles.filter(
      (file) => !langFiles.includes(file)
    )
    const extraFiles = langFiles.filter(
      (file) => !referenceFiles.includes(file)
    )

    languageResult.missingFiles = missingFiles
    languageResult.extraFiles = extraFiles

    if (missingFiles.length > 0) {
      console.log(`   ❌ Missing files: ${missingFiles.join(', ')}`)
      languageResult.isPerfect = false
      finalReport.summary.totalMissingFiles += missingFiles.length
    }

    if (extraFiles.length > 0) {
      console.log(`   ➕ Extra files: ${extraFiles.join(', ')}`)
      languageResult.isPerfect = false
      finalReport.summary.totalExtraFiles += extraFiles.length
    }

    if (missingFiles.length === 0 && extraFiles.length === 0) {
      console.log(`   ✅ All files match`)
    }

    // Compare JSON structures for matching files
    const commonFiles = referenceFiles.filter((file) =>
      langFiles.includes(file)
    )

    if (commonFiles.length > 0) {
      console.log(
        `\n🔍 JSON structure comparison for ${commonFiles.length} common files:`
      )

      let totalIssues = 0
      const structureResults = []

      commonFiles.forEach((fileName) => {
        const referencePath = path.join(LOCALES_DIR, REFERENCE_LANG, fileName)
        const targetPath = path.join(LOCALES_DIR, langCode, fileName)

        const referenceJson = loadJsonFile(referencePath)
        const targetJson = loadJsonFile(targetPath)

        if (referenceJson && targetJson) {
          const comparison = compareJsonStructures(
            referenceJson,
            targetJson,
            fileName
          )
          structureResults.push(comparison)
          languageResult.structureResults.push(comparison)

          if (comparison.isIdentical) {
            console.log(
              `   ✅ ${fileName}: Perfect match (${comparison.referenceKeyCount} keys)`
            )
          } else {
            console.log(`   ⚠️  ${fileName}: Structure differences detected`)
            languageResult.isPerfect = false

            if (comparison.missingKeys.length > 0) {
              console.log(
                `      Missing keys (${comparison.missingKeys.length}): ${comparison.missingKeys.slice(0, 5).join(', ')}${comparison.missingKeys.length > 5 ? '...' : ''}`
              )
              totalIssues += comparison.missingKeys.length
              finalReport.summary.totalMissingKeys +=
                comparison.missingKeys.length
            }

            if (comparison.extraKeys.length > 0) {
              console.log(
                `      Extra keys (${comparison.extraKeys.length}): ${comparison.extraKeys.slice(0, 5).join(', ')}${comparison.extraKeys.length > 5 ? '...' : ''}`
              )
              totalIssues += comparison.extraKeys.length
              finalReport.summary.totalExtraKeys += comparison.extraKeys.length
            }

            console.log(
              `      Reference: ${comparison.referenceKeyCount} keys, Target: ${comparison.targetKeyCount} keys`
            )
          }
        }
      })

      languageResult.totalIssues = totalIssues

      // Summary for this language
      const perfectMatches = structureResults.filter(
        (r) => r.isIdentical
      ).length
      const withIssues = structureResults.filter((r) => !r.isIdentical).length

      console.log(`\n📊 ${langCode.toUpperCase()} Summary:`)
      console.log(`   Perfect matches: ${perfectMatches}/${commonFiles.length}`)
      console.log(`   Files with issues: ${withIssues}/${commonFiles.length}`)
      console.log(`   Total structural issues: ${totalIssues}`)

      if (withIssues === 0) {
        console.log(`   🎉 All files have identical structure!`)
      }
    }

    // Add language result to final report
    finalReport.languageResults.push(languageResult)

    // Update summary counts
    if (languageResult.isPerfect) {
      finalReport.summary.perfectLanguages++
    } else {
      finalReport.summary.languagesWithIssues++
    }
  })

  // Generate and display final report
  generateFinalReport(finalReport)
}

/**
 * Generate and display a comprehensive final report
 * @param {Object} finalReport - The collected analysis data
 */
function generateFinalReport(finalReport) {
  console.log(`\n${'='.repeat(80)}`)
  console.log('📋 FINAL LOCALE STATUS REPORT')
  console.log(`${'='.repeat(80)}`)

  // Overall summary
  console.log(`\n🌍 OVERALL SUMMARY:`)
  console.log(
    `   Reference Language: ${finalReport.referenceLanguage.toUpperCase()}`
  )
  console.log(`   Total Languages Analyzed: ${finalReport.totalLanguages}`)
  console.log(`   Reference Files: ${finalReport.referenceFileCount}`)
  console.log(`   Perfect Languages: ${finalReport.summary.perfectLanguages}`)
  console.log(
    `   Languages with Issues: ${finalReport.summary.languagesWithIssues}`
  )

  // Issue summary
  console.log(`\n📊 ISSUE SUMMARY:`)
  console.log(
    `   Total Missing Files: ${finalReport.summary.totalMissingFiles}`
  )
  console.log(`   Total Extra Files: ${finalReport.summary.totalExtraFiles}`)
  console.log(`   Total Missing Keys: ${finalReport.summary.totalMissingKeys}`)
  console.log(`   Total Extra Keys: ${finalReport.summary.totalExtraKeys}`)

  const totalIssues =
    finalReport.summary.totalMissingFiles +
    finalReport.summary.totalExtraFiles +
    finalReport.summary.totalMissingKeys +
    finalReport.summary.totalExtraKeys

  console.log(`   Total Issues: ${totalIssues}`)

  // Language status breakdown
  console.log(`\n🏳️  LANGUAGE STATUS BREAKDOWN:`)

  // Perfect languages
  const perfectLanguages = finalReport.languageResults.filter(
    (lang) => lang.isPerfect
  )
  if (perfectLanguages.length > 0) {
    console.log(`\n   ✅ PERFECT LANGUAGES (${perfectLanguages.length}):`)
    perfectLanguages.forEach((lang) => {
      console.log(
        `      ${lang.languageCode.toUpperCase()} - ${lang.fileCount} files, 0 issues`
      )
    })
  }

  // Languages with issues
  const languagesWithIssues = finalReport.languageResults.filter(
    (lang) => !lang.isPerfect
  )
  if (languagesWithIssues.length > 0) {
    console.log(
      `\n   ⚠️  LANGUAGES WITH ISSUES (${languagesWithIssues.length}):`
    )
    languagesWithIssues.forEach((lang) => {
      const fileIssues = lang.missingFiles.length + lang.extraFiles.length
      const keyIssues = lang.totalIssues
      const totalLangIssues = fileIssues + keyIssues

      console.log(
        `      ${lang.languageCode.toUpperCase()} - ${lang.fileCount} files, ${totalLangIssues} issues`
      )

      if (lang.missingFiles.length > 0) {
        console.log(`         Missing files: ${lang.missingFiles.join(', ')}`)
      }
      if (lang.extraFiles.length > 0) {
        console.log(`         Extra files: ${lang.extraFiles.join(', ')}`)
      }
      if (keyIssues > 0) {
        console.log(
          `         Key issues: ${keyIssues} (missing/extra keys in JSON structure)`
        )
      }
    })
  }

  // Recommendations
  console.log(`\n💡 RECOMMENDATIONS:`)
  if (finalReport.summary.perfectLanguages === finalReport.totalLanguages) {
    console.log(
      `   🎉 All languages are perfectly synchronized! No action needed.`
    )
  } else {
    console.log(
      `   🔧 Action needed for ${finalReport.summary.languagesWithIssues} language(s):`
    )

    if (finalReport.summary.totalMissingFiles > 0) {
      console.log(
        `      • Add ${finalReport.summary.totalMissingFiles} missing file(s)`
      )
    }
    if (finalReport.summary.totalExtraFiles > 0) {
      console.log(
        `      • Remove ${finalReport.summary.totalExtraFiles} extra file(s)`
      )
    }
    if (finalReport.summary.totalMissingKeys > 0) {
      console.log(
        `      • Add ${finalReport.summary.totalMissingKeys} missing key(s)`
      )
    }
    if (finalReport.summary.totalExtraKeys > 0) {
      console.log(
        `      • Remove ${finalReport.summary.totalExtraKeys} extra key(s)`
      )
    }
  }

  // Health score
  const healthScore = Math.round(
    (finalReport.summary.perfectLanguages / finalReport.totalLanguages) * 100
  )
  console.log(`\n📈 LOCALE HEALTH SCORE: ${healthScore}%`)

  if (healthScore === 100) {
    console.log(`   🏆 Excellent! All locales are perfectly synchronized.`)
  } else if (healthScore >= 80) {
    console.log(`   👍 Good! Most locales are synchronized with minor issues.`)
  } else if (healthScore >= 60) {
    console.log(`   ⚠️  Fair! Several locales need attention.`)
  } else {
    console.log(
      `   🚨 Poor! Many locales have significant issues that need immediate attention.`
    )
  }

  console.log(`\n${'='.repeat(80)}`)
  console.log('✅ Final report complete!')
  console.log(`${'='.repeat(80)}`)
}

// Run the analysis
if (require.main === module) {
  analyzeLocales()
}

module.exports = {
  analyzeLocales,
  compareJsonStructures,
  getAllKeys,
  generateFinalReport,
}
