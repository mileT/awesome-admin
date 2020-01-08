
cp ./src/main/resources/application-$PACKAGE_LABEL.yml ./src/main/resources/application.yml

mvn -U clean package -Dappname=$APP_NAME -P$PACKAGE_LABEL