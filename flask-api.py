from flask import Flask, jsonify, abort, request
from flask_cors import CORS
from werkzeug.middleware.dispatcher import DispatcherMiddleware
from werkzeug.serving import run_simple
import psycopg2

app = Flask(__name__)
CORS(app)

# Only allow these tables
ALLOWED_TABLES = {
    "users": "id",
    "courses": "id",
    "course_assignment": "id"
}

def get_connection():
    return psycopg2.connect(
        host="localhost",
        database="apidb",
        user="apiuser",
        password="apiuser123+"
    )

def query_to_dicts(cur):
    """Convert cursor result to list of dicts using column names"""
    cols = [desc[0] for desc in cur.description]
    return [dict(zip(cols, row)) for row in cur.fetchall()]

@app.route('/<table>')
def get_all_or_filtered(table):
    if table not in ALLOWED_TABLES:
        abort(404)

    # Build WHERE clause from query parameters
    filters = []
    values = []
    for key, value in request.args.items():
        filters.append(f"{key} = %s")
        values.append(value)

    where_clause = f"WHERE {' AND '.join(filters)}" if filters else ""
    query = f'SELECT * FROM "{table}" {where_clause};'

    conn = get_connection()
    cur = conn.cursor()

    try:
        cur.execute(query, tuple(values))
        rows = query_to_dicts(cur)
    except Exception as e:
        cur.close()
        conn.close()
        return jsonify({"error": str(e)}), 400

    cur.close()
    conn.close()
    return jsonify(rows)

@app.route('/<table>/<int:record_id>')
def get_by_id(table, record_id):
    if table not in ALLOWED_TABLES:
        abort(404)

    id_field = ALLOWED_TABLES[table]
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(f'SELECT * FROM "{table}" WHERE {id_field} = %s;', (record_id,))
    row = cur.fetchone()
    if row:
        result = dict(zip([desc[0] for desc in cur.description], row))
        cur.close()
        conn.close()
        return jsonify(result)
    else:
        cur.close()
        conn.close()
        abort(404)

application = DispatcherMiddleware(Flask('dummy_app'), {
    '/prod': app
})

if __name__ == '__main__':
    run_simple('0.0.0.0', 5000, application)
