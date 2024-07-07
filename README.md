# wallet

## Commands

### Consolidate Fixed Income

To consolidate fixed income assets, you can use the following command:

```bash
python manage.py consolidate_fixed_income --tickers TICKER1 TICKER2
```



### Marcadores de Commit
- **feat** : Adição de uma nova funcionalidade (feature).
- **fix** : Correção de um bug.
- **chore** : Tarefas de manutenção que não afetam a lógica do código (como atualização de dependências).
- **docs** : Alterações na documentação.
- **style** : Mudanças que não afetam o significado do código (espaços em branco, formatação, ponto e vírgula faltando, etc.).
- **refactor** : Alteração de código que não corrige bugs nem adiciona funcionalidades (melhorias internas de código).
- **perf** : Mudanças que melhoram o desempenho.
- **test** : Adição ou correção de testes.
- **ci** : Mudanças nos arquivos de configuração e scripts de CI (integração contínua).
- **build** : Mudanças que afetam o sistema de build ou dependências externas (como gulp, broccoli, npm).
- **revert** : Reversão de um commit anterior.
- **wip** : Work in Progress (trabalho em progresso), utilizado para indicar que a mudança ainda não está completa.

### Configuração de HTTPS e Cookies Seguros no Ambiente de Desenvolvimento

Para garantir que os cookies sejam configurados corretamente em um ambiente de desenvolvimento, é necessário utilizar HTTPS. Isso se deve às políticas de segurança modernas dos navegadores, que exigem que certos tipos de cookies (como `SameSite=None` e `Secure`) sejam enviados apenas através de conexões HTTPS.

#### Por Que HTTPS é Necessário

Ao configurar cookies com atributos `SameSite=None` e `Secure`, os navegadores requerem uma conexão HTTPS. Sem HTTPS, os cookies não serão aceitos ou poderão ser bloqueados, o que impede funcionalidades importantes como a autenticação e a manutenção de sessões.

#### Utilizando Certificados Autoassinados para Desenvolvimento

Para um ambiente de desenvolvimento, você pode usar certificados autoassinados para configurar HTTPS sem a necessidade de um certificado oficial. Embora navegadores possam exibir avisos sobre a segurança dos certificados autoassinados, isso é aceitável em um ambiente de desenvolvimento.

### Passos para Configurar HTTPS com Certificados Autoassinados

#### 1. Gerar Certificados Autoassinados

Você pode gerar um certificado autoassinado usando o comando `openssl`:

```bash
mkdir -p certs
openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout certs/localhost.key -out certs/localhost.crt -subj "/CN=localhost"
```

#### 2. Configurar Nginx como Proxy Reverso com HTTPS

Crie um arquivo de configuração do Nginx (`nginx.conf`) para atuar como um proxy reverso, que irá encaminhar as requisições HTTPS para seus serviços de backend e frontend.

```nginx
events {}

http {
    server {
        listen 443 ssl;
        server_name localhost;

        ssl_certificate /etc/nginx/certs/localhost.crt;
        ssl_certificate_key /etc/nginx/certs/localhost.key;

        location / {
            proxy_pass http://frontend:3000;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        location /api {
            proxy_pass http://backend:8000;
        }

        location /static {
            alias /code/static;
        }
    }

    server {
        listen 80;
        server_name localhost;

        location / {
            return 301 https://$host$request_uri;
        }
    }
}
```

#### 3. Atualizar `docker-compose.yml`

Adicione um serviço para o Nginx no seu arquivo `docker-compose.yml`:

```yaml
  nginx:
    image: nginx:latest
    container_name: nginx
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./certs:/etc/nginx/certs
      - ./backend:/code
    ports:
      - "443:443"
      - "80:80"
    depends_on:
      - backend
      - frontend

```

#### 4. Atualizar Variáveis de Ambiente do Frontend

Certifique-se de que a URL do backend use HTTPS no arquivo `.env.development` do frontend:

```env
NEXT_PUBLIC_BACKEND_URL=https://localhost/api
```

#### 5. Executar os Serviços

Finalmente, execute os serviços Docker:

```bash
docker-compose up --build
```

### Acessar a Aplicação

Com essas configurações, sua aplicação deve ser acessível via HTTPS em `https://localhost`. O Nginx gerenciará a criptografia HTTPS e redirecionará as requisições apropriadas para os contêineres do backend e frontend.