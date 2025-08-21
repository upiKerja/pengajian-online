import prologue
import views

let
  indexPatterns* = @[
    pattern("/", views.index, @[HttpGet], name = "index"),
    pattern("/kelas", views.kelas, @[HttpGet], name = "kelas"),
    pattern("/profile", views.profile, @[HttpGet], name="profile")
  ]