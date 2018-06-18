require_relative "lib/bwa/version"

Gem::Specification.new do |s|
  s.name = 'balboa_worldwide_app'
  s.version = BWA::VERSION
  s.platform = Gem::Platform::RUBY
  s.authors = ["Cody Cutrer"]
  s.email = "cody@cutrer.com'"
  s.homepage = "https://github.com/ccutrer/bwa"
  s.summary = "Library for communication with Balboa Water Group's WiFi module"
  s.license = "MIT"

  s.executables = ['bwa_client', 'bwa_server', 'bwa_proxy']
  s.files = Dir["{bin,lib}/**/*"]

  s.add_dependency 'digest-crc', "~> 0.4"

  s.add_development_dependency 'byebug', "~> 9.0"
end
