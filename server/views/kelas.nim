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
    proc myRenderProc(
        title: string,
        description: string): string =
        compileTemplateFile("../../src/pages/kelas/page.xhtml", baseDir = getScriptDir())    
    
    var
        slug = ctx.getPathParams("slug")
        ball = puppy.get(
            fmt"http://localhost:8081/kelas/meta/{slug}")
        sukamto = parseJson ball.body

    if sukamto["data"].len > 0:
        resp myRenderProc(
            getStr sukamto["data"]["judul"],
            getStr sukamto["data"]["deskripsi"])        
    else :
        resp "<h1>404 Not Found</h1>"


proc kelasDaftar*(ctx: Context) {.async.} =
    resp "Ini Rijal"