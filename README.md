# roomreach

## Setup

### Prerequisites
1. Install [Node.js](https://nodejs.org/en/download/)
2. Install [PostgreSQL](https://www.postgresql.org/download/)
3. Install [Git](https://git-scm.com/downloads)
4. Install [go](https://golang.org/doc/install)

### Clone the repository
```bash
git clone https://github.com/lemonnuggets/roomreach.git
```

### Create the database
```bash
psql -U postgres -f room_reach.sql
```

### Install server dependencies
```bash
# ./roomreach/server
go install
```

### Run the server
```bash
# ./roomreach/server
go run .
```

### Install app dependencies
```bash
# ./roomreach/app
npm install
```

### Run app
```bash
npm start
```
