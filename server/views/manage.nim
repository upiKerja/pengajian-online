import 
    prologue,
    strutils,
    streams,
    puppy,
    json

proc loadFromTemplate(
    html: string,
    data: JsonNode
) : string =
    let
        templ = readAll newFileStream("src/pages/admin/template.upi", fmRead)
        dataa = %*{"result" : data}
        page = templ % ["adminContent", html] % ["dataUpi", $dataa]

    return page

proc manageKelas*(ctx: Context) {.async.} =
    var
        ac = ctx.getCookie("access_token")
        dapda = 
            puppy.get("http://localhost:8081/api/kelas/select?w=id_kelas&eq=" &
            $ctx.getPathParams("id_kelas"),
            @[("Cookie", "access_token=" & ac)])
    
    if dapda.code == 200 :
        let
            jsonn = parseJson(dapda.body)
            file = newFileStream("src/pages/manage/kelas.upi", fmRead)
            page = loadFromTemplate( readAll file, jsonn )

        resp strip page

    else :
        echo $dapda.body
        echo ctx.getPathParams("id_kelas")

        resp $dapda.code   
