import { Navbar, Container, Nav, NavbarToggle } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Icon from "@mdi/react";
import { mdiMusicCircle, mdiFolderMusic, mdiPlaylistMusic, mdiAlbum, mdiDownload } from "@mdi/js";

function Header() {
    let navigate = useNavigate();

    return (
        <Navbar bg="dark" data-bs-theme="dark">
            <Container>
                <Navbar.Brand>
                    <Icon path={mdiMusicCircle} size={1} color={"white"} />
                    YM Player
                </Navbar.Brand>
                <Nav className="me-auto">
                    <Nav.Link onClick={() => navigate("/music")}>
                        <Icon path={mdiFolderMusic} size={1} />
                        Music
                    </Nav.Link>
                    <Nav.Link onClick={() => navigate("/playlist")}>
                        <Icon path={mdiPlaylistMusic} size={1} />
                        Playlist
                    </Nav.Link>
                    <Nav.Link onClick={() => navigate("/album")}>
                        <Icon path={mdiAlbum} size={1} />
                        Album
                    </Nav.Link>
                    <Nav.Link onClick={() => navigate("/download")}>
                        <Icon path={mdiDownload} size={1} />
                        Download
                    </Nav.Link>
                </Nav>
            </Container>
        </Navbar>
    );
}

export default Header;
