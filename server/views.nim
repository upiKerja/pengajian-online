import prologue

proc index*(ctx: Context) {.async.} =
    resp "Hello World!"

proc kelas*(ctx: Context) {.async.} =
    await ctx.staticFileResponse("kelasmengaji.html", "src/pages")