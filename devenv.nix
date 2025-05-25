{ pkgs, ... }:
{
  # Nixpkgs overlays and extra packages
  packages = [
    pkgs.nodejs_20
    pkgs.yarn
    pkgs.docker
    pkgs.git
    pkgs.just
    pkgs.curl
    # pkgs.ollama # Uncomment if available in your channel
  ];

  # Set up environment variables for backend/frontend
  env.OLLAMA_URL = "http://localhost:11434";
  env.OLLAMA_MODEL = "llama3";
  env.NODE_ENV = "development";

  # Use scripts to print welcome message (shellHook is not supported in devenv.nix)
  scripts.welcome.exec = ''
    echo "\nWelcome to the SOW Template Service Dev Environment!"
    echo "Node: $(node --version)"
    echo "Yarn: $(yarn --version)"
    echo "Docker: $(docker --version)"
    echo "Just: $(just --version)"
  '';
}
