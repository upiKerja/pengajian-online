import 
    prologue,
    strutils,
    streams

proc loadFromTemplate(
    html: string
) : string =
    let
        templ = readAll newFileStream("src/pages/admin/template.upi", fmRead)
        page = templ.replace("\n", "") % ["adminContent", html]

    return page

proc adminManageKajian*(ctx: Context) {.async.} =
    resp strip loadFromTemplate readAll newFileStream("src/pages/admin/manageKajian.upi", fmRead)

proc adminManageKelas*(ctx: Context) {.async.} =
    resp strip loadFromTemplate readAll newFileStream("src/pages/admin/manageKelas.upi", fmRead)

proc adminManageMentor*(ctx: Context) {.async.} =
    resp strip loadFromTemplate readAll newFileStream("src/pages/admin/manageMentor.upi", fmRead)

proc adminManageSedekah*(ctx: Context) {.async.} =
    resp strip loadFromTemplate readAll newFileStream("src/pages/admin/manageSedekah.upi", fmRead)

proc adminIndex*(ctx: Context) {.async.} =
    resp strip loadFromTemplate readAll newFileStream("src/pages/admin/dashboard.upi", fmRead)