'use strict';

var express = require( 'express' );
var parser = require( 'body-parser' );

var jsonBody = parser.json();

var app = express();

var Storage = function Storage() {
  this.items = [];
  this.id = 0;
};

Storage.prototype.add = function add( name ) {
  var item = {
    name: name,
    id: this.id
  };

  this.items.push( item );

  this.id += 1;

  return item;
};

Storage.prototype.update = function update( id, item ) {
  if ( !this.items[id] ) {
    return this.add( item.name );
  }

  this.items[id].name = item.name;

  return this.items[id];
};

Storage.prototype.remove = function remove( id ) {
  var item = this.items[id];

  this.items.splice( id, 1 );

  return item;
};

var storage = new Storage();

storage.add( 'Broad beans' );
storage.add( 'Tomatoes' );
storage.add( 'Peppers' );

app.use( express.static( 'public' ));

app.get( '/items', function( req, res ) {
  res.json( storage.items );
});

app.post( '/items', jsonBody, function( req, res ) {
  if ( !req.body ) {
    return res.sendStatus( 400 );
  }

  var item = storage.add( req.body.name );

  res.status( 201 ).json( item );
});

app.delete( '/items/:id', function( req, res ) {
  if ( !req.params.id ) {
    return res.sendStatus( 400 );
  }

  var item = storage.remove( req.params.id );

  if ( !item ) {
    return res.status( 404 ).json({
      error: 'ID supplied is incorrect.'
    });
  }

  return res.json( item );
});

app.put( '/items/:id', jsonBody, function( req, res ) {
  if ( !req.body ) {
    return res.sendStatus( 400 );
  }

  var item = storage.update( req.params.id, req.body );

  return res.json( item );
});

app.listen( process.env.PORT || 8080 );
