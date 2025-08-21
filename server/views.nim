import prologue

proc index*(ctx: Context) {.async.} =
    await ctx.staticFileResponse("index.html", "src")

proc kelas*(ctx: Context) {.async.} =
    await ctx.staticFileResponse("kelasmengaji.html", "src/pages")

proc profile*(ctx: Context) {.async.} =
    await ctx.staticFileResponse("profile.html", "src/pages")