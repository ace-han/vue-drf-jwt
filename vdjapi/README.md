# Vue-Django-JWT Backend API

## Pre


```sh
# setup the db
mysql -u root

CREATE DATABASE `vdjapi` CHARACTER SET utf8 COLLATE utf8_general_ci;
GRANT ALL ON `vdjapi`.* TO `vdjapi`@`localhost` IDENTIFIED BY 'vdjapi';
FLUSH PRIVILEGES;

# install python libs
pip install -r requirements.txt

# setup model migration
python manage.py makemigrations
python manage.py migrate

# run it
python manage.py runserver 0.0.0.0:8090

# create login user
python manage.py createsuperuser

# open browser to test
open http://0.0.0.0:8090/

# http://django-reversion.readthedocs.io/en/latest/commands.html
# everytime registering a new model with django-reversion.
./manage.py createinitialrevisions
./manage.py createinitialrevisions your_app.YourModel --comment="Initial revision."

# should be in a crontab

./manage.py deleterevisions
# keep any changes from last 30 days
./manage.py deleterevisions your_app.YourModel --days=30
# keep 30 most recent changes for each item.
./manage.py deleterevisions your_app.YourModel --keep=30
# Keep anything from last 30 days and at least 3 from older changes.
./manage.py deleterevisions your_app.YourModel --keep=3 --days=30


```