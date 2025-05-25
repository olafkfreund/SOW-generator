{pkgs, ...}: {
  # Development packages
  packages = with pkgs;
    [
      nodejs_18
      yarn
      docker
      git
      just
      curl
      python3
      python3Packages.pip
      python3Packages.virtualenv
    ]
    ++ lib.optionals stdenv.isLinux [
      # Add ollama if available on the system
      ollama
    ];

  # Environment variables
  env.BACKEND_PORT = "4000";
  env.FRONTEND_PORT = "3000";
  env.OLLAMA_URL = "http://localhost:11434";
  env.OLLAMA_MODEL = "llama3";

  # Python environment setup
  languages.python = {
    enable = true;
    package = pkgs.python3;
    poetry.enable = false;
    venv.enable = true;
  };

  # Scripts for convenience
  scripts.welcome.exec = ''
    echo "🚀 SOW Template Service Development Environment"
    echo "==============================================="
    echo "Backend Port: $BACKEND_PORT"
    echo "Frontend Port: $FRONTEND_PORT"
    echo "Ollama URL: $OLLAMA_URL"
    echo ""
    echo "Available commands:"
    echo "  just install    - Install all dependencies"
    echo "  just build      - Build backend and frontend"
    echo "  just test       - Run all tests"
    echo "  just run        - Start development servers"
    echo "  pip install ... - Install Python packages"
    echo "  python -m venv venv - Create virtual environment"
    echo ""
    echo "Python version: $(python --version)"
    echo "Pip version: $(pip --version)"
  '';

  # Development shell setup
  enterShell = ''
    # Ensure Python virtual environment directory exists
    mkdir -p .venv

    # Set up Python path
    export PYTHONPATH="$PWD:$PYTHONPATH"

    # Run welcome script
    welcome
  '';

  # Process managers (optional)
  processes = {
    # You can define background processes here if needed
    # ollama.exec = "ollama serve --port 11434";
  };

  # Pre-commit hooks (optional)
  pre-commit.hooks = {
    # nixpkgs-fmt.enable = true;
    # eslint.enable = true;
  };
}
