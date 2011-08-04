require "./lib/init"

disable :logging
set :root, File.dirname(__FILE__) + "/../"

get "/" do
  File.readlines("public/index.html")
end

get "/books" do
  content_type "application/json"
  File.readlines("public/books.json")
end

get "/favicon.ico" do
  ""
end

