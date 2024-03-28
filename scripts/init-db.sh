# DB Configuration Variables
db_user='postgres'
db_pass='smba(12ou1rh&!ez9re$$&i1p=*a_#=otln$9))#ou77n1b=)@'
db_name='r2dliu_db'

if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    # Install system requirements
    sudo apt-get update
    # Install PostgreSQL
    which psql
    if [ "$?" ]; then
        echo "Postgres is already installed"
    else
        sudo apt install postgresql postgresql-contrib -y
    fi
elif [[ "$OSTYPE" == "darwin"* ]]; then
    # Mac OSX
    # WIP
    which brew
    if ! [ "$?" ]; then
        /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    fi
    echo "##### Updating Brew..."
    brew update
    which psql:
    if ! [ "$?" ]; then
        brew install postgresql
    fi
elif [[ "$OSTYPE" == "win32" ]]; then
    # Windows
    # WIP
    echo "WIP"
else
    echo "Unknown Operating System!"
fi

# Install Postgres, create database, and grant privs
sudo_p_user='postgres'
if [[ "$OSTYPE" == "darwin"* ]]; then
    sudo_p_user=$(whoami)
fi

echo "##### postresql is installed"

echo "##### Dropping the DB if it already exists"
dropdb $db_name
DROPDB_SUCCESS=$?

echo "##### Creating database: $db_name"
sudo -u $sudo_p_user createdb $db_name

if [ $DROPDB_SUCCESS != 0 ] ; then
    # db didn't exist. Assume users and permissions are missing
    echo "##### Creating user: $db_user"
    sudo -u $sudo_p_user psql -c "CREATE USER $db_user WITH PASSWORD '$db_pass';"
    echo "##### Giving user permission to create the test db"
    sudo -u $sudo_p_user psql -c "ALTER USER $db_user CREATEDB;"
fi

echo "##### Giving user permission to the database"
sudo -u $sudo_p_user psql -c "GRANT ALL PRIVILEGES ON DATABASE $db_name to $db_user;"
