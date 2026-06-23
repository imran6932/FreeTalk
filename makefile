my-commands:cmds

# ============================================================
#  Install Node.js 24, npm, and Yarn on Ubuntu
# ===========================================================


REQUIRED_NODE_MAJOR := 24

# ─── Full Setup ──────────────────────────────────────────────
install-frontend-requirements: install-node install-yarn
	@echo ""
	@echo "✅  All done! Node.js 24, npm, and Yarn are installed."
	@$(MAKE) versions

# ─── Node.js 24 + npm ────────────────────────────────────────
install-node:
	@REQUIRED=$(REQUIRED_NODE_MAJOR); \
	if command -v node > /dev/null 2>&1; then \
		CURRENT=$$(node -e "process.stdout.write(String(process.versions.node.split('.')[0]))"); \
		if [ "$$CURRENT" -ge "$$REQUIRED" ]; then \
			echo "⏭  Node.js v$$CURRENT is already installed and meets v$(REQUIRED_NODE_MAJOR) — skipping."; \
		else \
			echo "⚠️  Node.js v$$CURRENT found — upgrading to v$(REQUIRED_NODE_MAJOR)..."; \
			sudo apt update; \
			sudo apt install -y curl; \
			curl -fsSL https://deb.nodesource.com/setup_$(REQUIRED_NODE_MAJOR).x | sudo bash -; \
			sudo apt install -y nodejs; \
			echo "✅  Node.js upgraded to $$(node -v)."; \
		fi \
	else \
		echo ">>> Node.js not found — installing v$(REQUIRED_NODE_MAJOR)..."; \
		sudo apt update; \
		sudo apt install -y curl; \
		curl -fsSL https://deb.nodesource.com/setup_$(REQUIRED_NODE_MAJOR).x | sudo bash -; \
		sudo apt install -y nodejs; \
		echo "✅  Node.js $$(node -v) and npm $$(npm -v) installed."; \
	fi

# ─── Yarn ────────────────────────────────────────────────────
install-yarn:
	@if command -v yarn > /dev/null 2>&1; then \
		echo "⏭  Yarn is already installed: $$(yarn -v) — skipping."; \
	else \
		echo ">>> Enabling Corepack..."; \
		sudo corepack enable; \
		echo ">>> Installing latest stable Yarn..."; \
		corepack prepare yarn@stable --activate; \
		echo "✅  Yarn installed."; \
	fi

# ─── Versions ────────────────────────────────────────────────
versions:
	@echo ""
	@echo "  Node.js : $$(node -v)"
	@echo "  npm     : $$(npm -v)"
	@echo "  Yarn    : $$(yarn -v)"
	@echo ""


docker-install:
	@if docker --version >/dev/null 2>&1 && docker compose version >/dev/null 2>&1; then \
		echo "`docker --version`"; \
		echo "`docker compose version`"; \
		echo "Docker already installed"; \
	else \
		sudo apt-get update && \
		sudo apt-get install -y ca-certificates curl && \
		sudo install -m 0755 -d /etc/apt/keyrings && \
		sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc && \
		sudo chmod a+r /etc/apt/keyrings/docker.asc && \
		echo "deb [arch=$$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $$([ -f /etc/os-release ] && . /etc/os-release && echo $$VERSION_CODENAME) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null && \
		sudo apt-get update && \
		sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin && \
		echo "Docker installed successfully"; \
		echo "`docker --version`"; \
		echo "`docker compose version`";	\
	fi

nginx-install:
	@nginx -v >/dev/null 2>&1 && certbot --version >/dev/null 2>&1 && echo "Nginx and Certbot already installed" || ( \
		sudo apt-get update && \
		sudo apt-get install -y nginx certbot python3-certbot-nginx && \
		sudo systemctl enable nginx && \
		sudo systemctl start nginx && \
		echo "Nginx and Certbot installed successfully"; \
		nginx -v; \
		certbot --version; \
	)


docker-compose-build:
	@docker-compose build --no-cache

docker-compose-up:
	@docker-compose up -d
	@docker image prune -a -f

docker-compose-down:
	@docker-compose down

nginx-restart:
	sudo systemctl reload nginx


freetalk-react-build:
	@cd /home/FreeTalk/frontend && yarn install && yarn run build

freetalk-react-clean:
	@cd /home/FreeTalk/frontend && sudo rm -rf node_modules

freetalk-admin-react-build:
	@cd /home/FreeTalk/admin && yarn install && yarn run build

freetalk-admin-react-clean:
	@cd /home/FreeTalk/admin && sudo rm -rf node_modules

docker-compose-restart: install-frontend-requirements freetalk-react-build freetalk-admin-react-build docker-compose-down docker-compose-build  	 docker-compose-up nginx-restart
	@echo "Docker compose restarted."


cmds:
	@echo "Available commands:"
	@echo " make docker-install - to install Docker and Docker Compose"
	@echo "  make nginx-install - to install Nginx and Certbot"
	@echo "  make freetalk-react-build - to build the freetalk-react app"
	@echo "  make freetalk-react-clean - to clear the freetalk-react app node_modules"
	@echo "  make freetalk-admin-react-build - to build the freetalk-admin-react app"
	@echo "  make freetalk-admin-react-clean - to clear the freetalk"
	@echo "  make docker-compose-restart - to restart the docker compose"
	@echo "  make docker-compose-build - to build the docker compose"
	@echo "  make docker-compose-up - to start the docker compose"
	@echo "  make docker-compose-down - to stop the docker compose"
	@echo "    install-frontend-requirements     Install Node.js 24, npm, and Yarn (full setup)"
	@echo "    install-node    Install Node.js 24 and npm"
	@echo "    install-yarn    Install Yarn (requires Node.js already installed)"
	@echo "    versions        Print installed versions"