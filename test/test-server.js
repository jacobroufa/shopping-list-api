'use strict';

var chai = require( 'chai' );
var chaiHttp = require( 'chai-http' );
var server = require( '../server.js' );

var should = chai.should();
var app = server.app;
var storage = server.storage;

chai.use( chaiHttp );

describe( 'Shopping List', function() {
  it( 'should list items on GET', function( done ) {
    chai.request( app )
      .get( '/items' )
      .end( function( err, res ) {
        should.equal( err, null );
        res.should.have.status( 200 );
        res.should.be.json;
        res.body.should.be.a( 'array' );
        res.body.should.have.length( 3 );
        res.body[0].should.be.a( 'object' );
        res.body[0].should.have.property( 'id' );
        res.body[0].should.have.property( 'name' );
        res.body[0].id.should.be.a( 'number' );
        res.body[0].name.should.be.a( 'string' );
        res.body[0].name.should.equal( 'Broad beans' );
        res.body[1].name.should.equal( 'Tomatoes' );
        res.body[2].name.should.equal( 'Peppers' );
        done();
      });
  });
  it( 'should add an item on POST', function( done ) {
    chai.request( app )
      .post( '/items' )
      .send({ 'name': 'Kale' })
      .end( function( err, res ) {
        should.equal( err, null );
        res.should.have.status( 201 );
        res.should.be.json;
        res.body.should.be.a( 'object' );
        res.body.should.have.property( 'name' );
        res.body.should.have.property( 'id' );
        res.body.name.should.be.a( 'string' );
        res.body.id.should.be.a( 'number' );
        res.body.name.should.equal( 'Kale' );
        storage.items.should.be.a( 'array' );
        storage.items.should.have.length( 4 );
        storage.items[3].should.be.a( 'object' );
        storage.items[3].should.have.property( 'id' );
        storage.items[3].should.have.property( 'name' );
        storage.items[3].id.should.be.a( 'number' );
        storage.items[3].name.should.be.a( 'string' );
        storage.items[3].name.should.equal( 'Kale' );
        done();
      });
  });
  it( 'should edit an item on PUT', function( done ) {
    chai.request( app )
      .put( '/items/2' )
      .send({ 'name': 'Chai' })
      .end( function( err, res ) {
        should.equal( err, null );
        res.should.have.status( 200 );
        res.should.be.json;
        res.body.should.be.a( 'object' );
        res.body.should.have.property( 'name' );
        res.body.should.have.property( 'id' );
        res.body.name.should.be.a( 'string' );
        res.body.id.should.be.a( 'number' );
        res.body.name.should.equal( 'Chai' );
        storage.items.should.be.a( 'array' );
        storage.items.should.have.length( 4 ); // earlier in the app we added one
        storage.items[2].should.be.a( 'object' );
        storage.items[2].should.have.property( 'id' );
        storage.items[2].should.have.property( 'name' );
        storage.items[2].id.should.be.a( 'number' );
        storage.items[2].name.should.be.a( 'string' );
        storage.items[2].name.should.equal( 'Chai' );
        done();
      });
  });
  it( 'should create a new item on PUT if given item does not exist', function( done ) {
    chai.request( app )
      .put( '/items/4' )
      .send({ 'name': 'Basil' })
      .end( function( err, res ) {
        should.equal( err, null );
        res.should.have.status( 201 );
        res.should.be.json;
        res.body.should.be.a( 'object' );
        res.body.should.have.property( 'name' );
        res.body.should.have.property( 'id' );
        res.body.name.should.be.a( 'string' );
        res.body.id.should.be.a( 'number' );
        res.body.name.should.equal( 'Basil' );
        storage.items.should.be.a( 'array' );
        storage.items.should.have.length( 5 );
        storage.items[4].should.be.a( 'object' );
        storage.items[4].should.have.property( 'id' );
        storage.items[4].should.have.property( 'name' );
        storage.items[4].id.should.be.a( 'number' );
        storage.items[4].name.should.be.a( 'string' );
        storage.items[4].name.should.equal( 'Basil' );
        done();
      });
  });
  it( 'should delete an item on DELETE', function( done ) {
    chai.request( app )
      .delete( '/items/2' )
      .end( function( err, res ) {
        should.equal( err, null );
        res.should.have.status( 200 );
        res.should.be.json;
        res.body.should.be.a( 'object' );
        res.body.should.have.property( 'name' );
        res.body.should.have.property( 'id' );
        res.body.name.should.be.a( 'string' );
        res.body.id.should.be.a( 'number' );
        res.body.name.should.equal( 'Chai' );
        storage.items.should.be.a( 'array' );
        storage.items.should.have.length( 4 );
        storage.items.forEach( function( item, id ) {
          storage.items[id].name.should.not.equal( 'Chai' );
        });
        done();
      });
  });
  it( 'should error when trying to DELETE a nonexistent item', function( done ) {
    chai.request( app )
      .delete( '/items/7' )
      .end( function( err, res ) {
        should.equal( err, null );
        res.should.have.status( 404 );
        res.should.be.json;
        res.body.should.be.a( 'object' );
        res.body.should.have.property( 'error' );
        res.body.error.should.equal( 'ID supplied is incorrect.' );
        done();
      });
  });
});
