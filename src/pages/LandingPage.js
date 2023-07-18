import React, { useEffect, useRef } from 'react';
import { AppBar, Toolbar, Typography, Container, Box, Grid, Button, Paper, CardMedia, Tabs, Tab } from '@mui/material';
import banner from "../assets/images/reciclagem.png";
import { Link } from "react-router-dom";
import background from "../assets/videos/background.mp4";


const LandingPage = () => {

    const videoRef = useRef(null);
    const handleScrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    };

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.playbackRate = 0.6;
        }
    }, []);

    const [selectedTab, setSelectedTab] = React.useState(0);

    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue);
    };
    return (
        <div style={{ backgroundColor: "#fff" }}>
            <AppBar position="fixed" sx={{ backgroundColor: "#27AB6E", height: "10vh", display: "flex", justifyContent: "center" }}>
                <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Box >
                        <Typography  style={{ fontFamily: 'Belanosima, sans-serif' }} variant="h5" component="h2" align="center" color="white" fontSize="50px">
                            ECOGESTOR
                        </Typography>
                    </Box>
                    <Box>

                        <Button color="inherit" onClick={() => handleScrollToSection("home")}>
                            Home
                        </Button>
                        <Button color="inherit" onClick={() => handleScrollToSection("whoisare")}>
                            Quem Somos
                        </Button>
                        <Button color="inherit" onClick={() => handleScrollToSection("contact")} >Contato</Button>
                        <Button color="inherit"> <Link to="/Signup" style={{ color: "white" }}>Registre-se</Link> </Button>
                        <Button color="inherit"><Link to="/Login" style={{ color: "white" }}>Login</Link></Button>
                    </Box>
                </Toolbar>
            </AppBar>
            <Box pt={10} width="99vw">
                <CardMedia
                    component="video"
                    src={background}
                    ref={videoRef}
                    autoPlay="true"
                    vi
                    loop
                    muted
                    width="95vw"
                    sx={{ position: 'absolute' }}
                />
            </Box>

            <Box height="90vh" display="flex" justifyContent="center" alignItems="center" sx={{position: 'relative'}}>
                <Typography className='tracking-in-expand'  textAlign="center" color='white' fontFamily='Belanosima, sans-serif' variant='h3' fontSize={80}>
                    Juntos, podemos fazer a diferença!
                </Typography>
            </Box>

            <Box
                pt={10}
                id="home"
                sx={{
                    height: '50vh',
                    display: 'flex',
                    alignItems: 'center',
                }}
            >
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 30, marginLeft: 20, marginRight: 20 }}>
                    <Box sx={{ width: "55%" }}>
                        <Typography variant="h2" sx={{ color: '#27AB6E', mb: 2 }}>
                            Bem-vindo!
                        </Typography>
                        <Typography variant="h5" sx={{ color: '#1C1C1C', mb: 4, textAlign: "justify" }}>
                            A EcoGestor é uma empresa dedicada à gestão de materiais recicláveis. Compramos e vendemos produtos como papel,
                            alumínio e plástico, contribuindo para a preservação do meio ambiente. Ao escolher nossa empresa, você fará parte de um movimento para um mundo mais sustentável, onde cada ação conta. Junte-se a nós e faça a diferença!
                        </Typography>
                        <Button variant="contained" color="success" sx={{ mr: 2, px: 4 }}>
                            Botão 1
                        </Button>
                        <Button variant="outlined" color="success" sx={{ px: 4 }}>
                            Botão 2
                        </Button>
                    </Box>
                    <Box sx={{ width: "40%" }}>
                        <CardMedia
                            component="img"
                            alt="produtos recicláveis"
                            image={banner}
                            sx={{ maxWidth: '100%' }}
                        />
                    </Box>
                </Box>
            </Box>

            {/* <Box sx={{
                height: '50vh', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320'%3E%3Cpath fill='%2327AB6E' fill-opacity='1' d='M0,224L48,229.3C96,235,192,245,288,234.7C384,224,480,192,576,202.7C672,213,768,267,864,261.3C960,256,1056,192,1152,160C1248,128,1344,128,1392,128L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat",
                backgroundSize: "cover"
            }}></Box> */}

            <Box sx={{ backgroundColor: "#27AB6E", height: 200, marginBottom: -75, marginTop: 40 }}></Box>
            <Box sx={{ py: 25 }}>
                <Box sx={{ py: 10, height: "100%" }}>
                    <Container  >
                        <Grid container spacing={4} >
                            <Grid item xs={12} sm={6} md={4} >
                                <Paper sx={{ p: 2, height: '100%' }}>
                                    <Typography variant="h4">Compramos</Typography>
                                    <Typography variant="body1">
                                        Que tal faturar ajudando? Junte e separe os materiais recicláveis, traga até nós ou agende uma coleta.
                                    </Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                                <Paper sx={{ p: 2, height: '100%' }}>
                                    <Typography variant="h4">Vendemos</Typography>
                                    <Typography variant="body1">
                                        Vendemos materiais de alta qualidade, separado e tratado por excelentes profissionais. O material sai daqui pronto para o processamento.
                                    </Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Paper sx={{ p: 2, height: '100%' }}>
                                    <Typography variant="h4">Coletamos</Typography>
                                    <Typography variant="body1">
                                        Possui material reciclável em casa e não tem como transportar? Deixa por nossa conta, registre-se, escolha um dia e um horário e enviamos uma equipe para a coleta, e você ainda recebe pelo material coletado.
                                    </Typography>
                                </Paper>
                            </Grid>
                        </Grid>
                    </Container>
                </Box >
                <Container sx={{ marginTop: "80px" }}>
                    <Tabs
                        value={selectedTab}
                        onChange={handleTabChange}
                        indicatorColor="primary"
                        textColor="primary"
                        centered
                        TabIndicatorProps={{
                            style: { backgroundColor: 'green' }
                        }}
                    >
                        <Tab label="Papel" sx={{
                            '&.Mui-selected': {
                                color: 'green'
                            }
                        }} />
                        <Tab label="Alumínio" sx={{
                            '&.Mui-selected': {
                                color: 'green'
                            }
                        }} />
                        <Tab label="Plástico" sx={{
                            '&.Mui-selected': {
                                color: 'green'
                            }
                        }} />
                    </Tabs>

                    {selectedTab === 0 && (
                        <Typography sx={{ p: 2, fontSize: 22 }}>
                            Dicas de reciclagem de papel:
                            <ul>
                                <li>Separar o papel limpo de outros resíduos</li>
                                <li>Evitar papel plastificado ou metalizado</li>
                                <li>Amassar ou picotar para facilitar o processo de reciclagem</li>
                            </ul>
                        </Typography>
                    )}

                    {selectedTab === 1 && (
                        <Typography sx={{ p: 2, fontSize: 22 }}>
                            Dicas de reciclagem de alumínio:
                            <ul>
                                <li>Amassar as latinhas de alumínio antes de descartar</li>
                                <li>Evitar misturar alumínio com outros materiais</li>
                                <li>Verificar se a reciclagem de alumínio é feita na sua região</li>
                            </ul>
                        </Typography>
                    )}

                    {selectedTab === 2 && (
                        <Typography sx={{ p: 2, fontSize: 22 }}>
                            Dicas de reciclagem de plástico:
                            <ul>
                                <li>Separar os diferentes tipos de plástico para reciclagem</li>
                                <li>Descartar tampas e rótulos separadamente</li>
                                <li>Evitar plásticos não recicláveis, como embalagens metalizadas</li>
                            </ul>
                        </Typography>
                    )}
                </Container>

            </Box>
            <Box sx={{ py: 4, backgroundColor: '#27AB6E', marginTop: -10 }}>
                <Container id="whoisare">
                    <Grid container spacing={4}>
                        <Grid item color="white">
                            <Typography variant="h4" sx={{ mb: 2 }}>
                                Sobre Nós
                            </Typography>
                            <Typography variant="body1" textAlign="justify" sx={{ mb: 2 }}>
                                Criada em 2023, a EcoGestor é referência em gestão de materiais recicláveis e comprometida em promover um futuro sustentável para o nosso planeta.
                            </Typography>
                            <Typography variant="body1" textAlign="justify" sx={{ mb: 2 }}>
                                A ideia surgiu pelo desejo de preservar os recursos naturais e reduzir o impacto ambiental, e é por isso que compramos e vendemos uma ampla variedade de produtos recicláveis, como papel, alumínio, plástico e muito mais. Através do nosso trabalho, estamos transformando resíduos em recursos valiosos.
                            </Typography>
                            <Typography variant="body1" textAlign="justify" sx={{ mb: 2 }}>
                                Ao escolher a EcoGestor como seu parceiro de negócios, você está contribuindo diretamente para um mundo melhor. Cada material reciclável que recolhemos e cada transação que realizamos tem um impacto positivo no meio ambiente, diminuindo a demanda por matérias-primas virgens e reduzindo a quantidade de resíduos que vão para aterros sanitários.
                            </Typography>
                            <Typography variant="body1" textAlign="justify" sx={{ mb: 2 }}>
                                Além disso, oferecemos um serviço de agendamento de coletas conveniente e eficiente. Nossa equipe especializada está pronta para ir até você, garantindo que seus materiais recicláveis sejam recolhidos de forma adequada e segura. Juntos, podemos tornar o processo de reciclagem simples e acessível.
                            </Typography>
                            <Typography variant="body1" textAlign="justify" sx={{ mb: 2 }}>
                                Todos nós da EcoGestor acreditamos que cada ação conta. Ao se juntar a nós, você se torna parte de um movimento global de conscientização ambiental e sustentabilidade. Juntos, podemos construir um futuro onde os recursos sejam utilizados de forma inteligente e responsável.
                            </Typography>
                            <Typography variant="body1" textAlign="justify" sx={{ mb: 2 }}>
                                Faça parte dessa mudança. Contate-nos hoje mesmo e descubra como podemos ajudá-lo a transformar resíduos em oportunidades, contribuindo para um planeta mais limpo e saudável.
                            </Typography>
                            <Typography variant="body1" textAlign="justify" sx={{ mb: 2 }}>
                                Juntos, podemos fazer a diferença!
                            </Typography>
                        </Grid>

                    </Grid>
                </Container>
            </Box>

            <Box sx={{ py: 4 }}>
                <Container id="contact">
                    <Grid container spacing={4}>
                        <Grid item >
                            <Typography variant="h4" sx={{ mb: 2 }}>
                                Contato
                            </Typography>
                            <Box display="flex" justifyContent="space-between" minWidth="600px">
                                <Box>
                                    <Typography variant="body1" textAlign="justify" sx={{ mb: 2 }}>
                                        Tel (16) 00000-0000
                                    </Typography>
                                    <Typography variant="body1" textAlign="justify" sx={{ mb: 2 }}>
                                        ecogestor@outlook.com
                                    </Typography>
                                </Box>

                                <Box>
                                    <Typography variant="body1" textAlign="justify" sx={{ mb: 2 }}>
                                        antonioalves.dev@outlook.com
                                    </Typography>
                                    <Typography variant="body1" textAlign="justify" sx={{ mb: 2 }}>
                                        sauloananias93@gmail.com
                                    </Typography>
                                </Box>
                            </Box>
                        </Grid>

                    </Grid>
                </Container>
            </Box>

            <AppBar position="static" sx={{ mt: 'auto', backgroundColor: "#27AB6E" }}>
                <Toolbar>
                    <Typography variant="body1" sx={{ flexGrow: 1, color: 'gray' }}>
                        &copy; 2023 EcoGestor. Todos os direitos reservados.
                    </Typography>
                    <Typography variant="body1" sx={{ flexGrow: 1, color: 'gray' }}>
                        Av. Tristão D'almeida 170, Distrito Industrial - Franca SP
                    </Typography>
                    <Button sx={{ color: "gray" }}>Política de Privacidade</Button>
                    <Button sx={{ color: "gray" }}>Termos de Uso</Button>
                </Toolbar>
            </AppBar>
        </div>
    );
};

export default LandingPage;
