import prologue
import nimja
import os
import puppy
import json
import strformat
import strutils

proc kelasIndex*(ctx: Context) {.async.} =
    resp loadPrologueEnv(".env").get("rijal")

proc kelasPage*(ctx: Context) {.async.} =
    proc myRenderProc(title: string, description: string): string =
        compileTemplateFile("../../src/pages/kelas/page.xhtml", baseDir = getScriptDir())    
    
    var
        slug = ctx.getPathParams("slug")
        ball = puppy.get(
            fmt"https://hggxutlouhypvgmrsjkm.supabase.co/rest/v1/kelas?slug=eq.{slug}&select=judul,deskripsi",
            @[("apikey", loadPrologueEnv(".env").get("SUPABASE_KEY"))]
        )
        sukamto = parseJson ball.body

    if sukamto.len > 0:
        resp myRenderProc(
            getStr sukamto[0]["judul"],
            getStr sukamto[0]["deskripsi"])        
    else :
        resp "<h1>404 Not Found</h1>"


proc kelasDaftar*(ctx: Context) {.async.} =
    resp "Ini Rijal"