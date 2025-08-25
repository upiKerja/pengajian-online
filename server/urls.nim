import prologue
import 
  views/dash,
  views/kelas

let
  indexPatterns* = @[
    pattern("/", dash.index, @[HttpGet], name = "index"),
    pattern("/profile", profile, @[HttpGet], name = "profile")
  ]
  kelasPatterns* = @[
    pattern("/", kelasIndex, @[HttpGet]),
    pattern("/daftar", kelasDaftar, @[HttpGet]),
    pattern("/{slug}", kelasPage, @[HttpGet])
  ]