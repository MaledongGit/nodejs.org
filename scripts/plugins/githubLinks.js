'use strict'

const sep = require('path').sep
// add suffix (".html" or sep for windows test) to each part of regex
// to ignore possible occurrences in titles (e.g. blog posts)
const isEditable = `(security|index).html|(about|download|docs|foundation|get-involved|knowledge)\\${sep}`
const isEditableReg = new RegExp(isEditable)

// This middleware adds "Edit on GitHub" links to every editable page
function githubLinks (options) {
  return (files, m, next) => {
    Object.keys(files).forEach((path) => {
      if (!isEditableReg.test(path)) {
        return
      }

      const file = files[path]
      path = path.replace('.html', '.md').replace(/\\/g, '/')
      const url = `https://github.com/nodejs/nodejs.org/edit/master/locale/${options.locale}/${path}`
      const editText = options.site.editOnGithub || 'Edit on GitHub'

      const contents = file.contents.toString() +
      ` <input type = "hidden" id = "editOnGitHubUrl" value="${url}"/> 
        <input type = "hidden" id = "editText" value="${editText}"/>`

      file.contents = Buffer.from(contents)
    })

    next()
  }
}

module.exports = githubLinks
