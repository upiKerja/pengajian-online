import prologue

proc kelasIndex*(ctx: Context) {.async.} =
    await ctx.staticFileResponse("index.html", "src/pages/kelas")

proc kelasPage*(ctx: Context) {.async.} =
    await ctx.staticFileResponse("page.html", "src/pages/kelas")  

proc kelasDaftar*(ctx: Context) {.async.} =
    resp "Ini Rijal"