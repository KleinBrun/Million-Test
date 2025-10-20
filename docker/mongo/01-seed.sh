set -euo pipefail

echo "⏳ Inicio de seed..."

DB="${MONGODB_DATABASE:-RealEstateDB}"
DIR="/docker-entrypoint-initdb.d/mongo_mocks"

AUTH_ARGS="--username ${MONGODB_ROOT_USER:-root} --password ${MONGODB_ROOT_PASSWORD:-rootpass} --authenticationDatabase admin"

import_one() {
    local coll="$1"
    local file="$2"
    local path="$DIR/$file"

    if [ ! -f "$path" ]; then
        echo "No existe archivo $path, omitiendo $coll"
        return 0
    fi

    echo "Importando $coll desde $file (intento sin auth)..."
    if mongoimport --db "$DB" --collection "$coll" --file "$path" --jsonArray; then
        echo "Import (sin auth) OK: $coll"
        return 0
    fi

    echo "Reintentando $coll con auth..."
    if mongoimport $AUTH_ARGS --db "$DB" --collection "$coll" --file "$path" --jsonArray; then
        echo "Import (con auth) OK: $coll"
        return 0
    fi

    echo "Falló import para $coll"
    return 1
}

create_indexes() {
  local js_noauth="const db = db.getSiblingDB('$DB');
    db.Properties.createIndex({ name: 1 });
    db.Properties.createIndex({ address: 1 });
    db.Properties.createIndex({ price: 1 });"

  echo "Creando índices (intento sin auth)..."
  if echo "$js_noauth" | mongosh --quiet ; then
    echo "Índices (sin auth) OK"
    return 0
  fi

  echo "Reintentando índices con auth..."
  if echo "$js_noauth" | mongosh --username "${MONGODB_ROOT_USER:-root}" --password "${MONGODB_ROOT_PASSWORD:-rootpass}" --authenticationDatabase admin --quiet ; then
    echo "Índices (con auth) OK"
    return 0
  fi

  echo " Falló creación de índices"
  return 1
}

echo "Archivos en $DIR:"
ls -l "$DIR" || true

import_one "Properties"      "properties.json"
import_one "Owners"          "owners.json"
import_one "PropertyImages"  "propertyimages.json"
import_one "PropertyTraces"  "propertytraces.json"

create_indexes

echo "Seed completado."
