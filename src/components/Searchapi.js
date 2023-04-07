import React from "react";
import { useState, useEffect } from "react";
import {
  Container,
  Input,
  Row,
  Card,
  Button,
  FormGroup,
  CardBody,
  CardTitle,
  CardImg,
} from "reactstrap";

const CLIENT_ID = "ae068d5eb87c41f794ba2eeda98ef93f";
const CLIENT_SECRET = "c82dc24bfa2d4dc182a435962d7b6f4c";
function Searchapi() {
  const [searchInput, setSearchInput] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [albums, setAlbum] = useState([]);    // Taking data as a array from this.. 
 
  useEffect(() => {
    // API Access Token
    var authParameter = {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" }, 
      body:                                           // POST method to check the token and authorization 
        "grant_type=client_credentials&client_id=" +
        CLIENT_ID +
        "&client_secret=" +
        CLIENT_SECRET,
    };
    fetch("https://accounts.spotify.com/api/token", authParameter)
      .then((result) => result.json())
      .then((data) => setAccessToken(data.access_token));
  }, []);

  //--------------- search ---------

  async function search() {
    console.log("Search for " + searchInput);   //jass manank

    // get request using search to get the artist 

    var searchParameters = {
      method: "GET",
      headers: {
        "Content-Type": "application/json", 
        Authorization: "Bearer " + accessToken,   // GET method for getting the value form POST
      },
    };

    var artistID = await fetch(
      "https://api.spotify.com/v1/search?q=" + searchInput + "&type=artist",   // getting the value of result as the id of artist
      searchParameters
    )
      .then((res) => res.json())
      .then((data) => {
        return data.artists.items[0].id;
      });

    console.log("artist id is " + artistID);

    // get Request with artistID grab all the album from that artistID

    var returnAlbum = await fetch(
      "https://api.spotify.com/v1/artists/" +
        artistID +
        "/albums" +
        "?include_groups=album&limit=50",    // market value for the specific country and limit is for the limit of the results.
      searchParameters
    )
      .then((res) => res.json())
      .then((data) => {
        setAlbum(data.items);
      });
    // display those album to the user
  }


  return (
    <>
      <Container>
        <h1 className="text-center align-content-center">Search Album Hear</h1>
      <hr></hr>
        <FormGroup >
          <Input
            placeholder="search for artist"
            type="input"
            onKeyPress={(event) => {
              if (event.key === "Enter") {
                search();
              }
            }}
            onChange={(event) => setSearchInput(event.target.value) }
            
          />
          <Button onClick={search} className="my-2">Search</Button>
        </FormGroup>
      </Container>
      <Row className="row row-cols-5 mx-2 gap-2">
        {albums.map((album, i) => {
          
          return (
            <Container>
            <Card key={i}>
              <CardImg src={album.images[0].url} />
              <CardBody>
                <CardBody>
                  <CardTitle>{album.name}</CardTitle>
                </CardBody>
              </CardBody>
            </Card>
            </Container>
          );
        })}
      </Row>
    </>
  );
}

export default Searchapi;
