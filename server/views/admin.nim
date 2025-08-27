import 
    prologue,
    strutils,
    streams

proc loadFromTemplate(
    html: string
) : string =
    let
        templ = readAll newFileStream("src/pages/admin/template.html", fmRead)
        page = templ.replace("\n", "") % ["adminContent", html]

    return page

proc adminManageKajian*(ctx: Context) {.async.} =
    resp strip loadFromTemplate readAll newFileStream("src/pages/admin/manageKajian.html", fmRead)

proc adminManageKelas*(ctx: Context) {.async.} =
    resp strip loadFromTemplate readAll newFileStream("src/pages/admin/manageKelas.html", fmRead)

proc adminManageMentor*(ctx: Context) {.async.} =
    resp strip loadFromTemplate readAll newFileStream("src/pages/admin/manageMentor.html", fmRead)

proc adminManageSedekah*(ctx: Context) {.async.} =
    resp strip loadFromTemplate readAll newFileStream("src/pages/admin/manageSedekah.html", fmRead)

proc adminIndex*(ctx: Context) {.async.} =
    resp strip loadFromTemplate readAll newFileStream("src/pages/admin/dashboard.html", fmRead)