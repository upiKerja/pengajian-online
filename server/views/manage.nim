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

proc manageKelas*(ctx: Context) {.async.} = 
    resp strip loadFromTemplate readAll newFileStream("src/pages/manage/kelas.upi", fmRead)

proc manageSedekah*(ctx: Context) {.async.} = 
    resp strip loadFromTemplate readAll newFileStream("src/pages/manage/sedekah.upi", fmRead)

proc manageMentor*(ctx: Context) {.async.} = 
    resp strip loadFromTemplate readAll newFileStream("src/pages/manage/mentor.upi", fmRead)

proc createDonasi*(ctx: Context) {.async.} = 
    resp strip loadFromTemplate readAll newFileStream("src/pages/create/donasi.upi", fmRead)