require 'yaml'

#
#
# deploy images via rsync
# details: https://github.com/KBalderson/Jekyll-Rake-RSync-Deploy
#
#
config_file = '_config.yml'
config = YAML.load_file(config_file)

env = ENV['env'] || 'stage'

task :deploy_images do
  command = "ssh #{config['environments'][env]['remote']['connection']} 'mkdir -p #{config['environments'][env]['remote']['path']}' "
  command << "&& rsync -avz --delete "
  command << "-e 'ssh -p #{config['environments'][env]['remote']['port']}' " unless config['environments'][env]['remote']['port'].nil?
  command << "#{config['destination']}/ #{config['environments'][env]['remote']['connection']}:#{config['environments'][env]['remote']['path']}"
  sh command
end
