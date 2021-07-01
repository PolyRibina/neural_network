import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import React, {Dispatch, SetStateAction, useState} from "react";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {
    Box,
    ButtonGroup,
    Container,
    TextField, Typography
} from "@material-ui/core";
import logoMainPage from './logoMainPage.png';
import TableOfContents from "./TableOfContents";
import Button from '@material-ui/core/Button';
import AuthPage from "./AuthPage";
import Api from "./Api";
import Hello1 from "./Приветствие.png";
import Hello2 from "./Приветствие2.png";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import LinearProgress, {LinearProgressProps} from "@material-ui/core/LinearProgress";
import GitHubIcon from '@material-ui/icons/GitHub';
import LiveHelpIcon from "@material-ui/icons/LiveHelp";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        paper: {
            padding: theme.spacing(2),
            textAlign: 'center',
            color: theme.palette.text.secondary,
        },
    }),
);

interface StandardComponentProps{
    prompts: string[]
    setPrompts: Dispatch<SetStateAction<never[]>>
}

let helpCount: number = 0;
let map2 = new Map()
let mapContentHelp = new Map()
let sectionsHelp: any[] = []
let mapContent = new Map<string[], string[]>() // <[раздел, тема, страница], [текст, код, подсказки]>
let int: number = 0;

function LinearProgressWithLabel(props: LinearProgressProps & { value: number }) {
    return (
        <Box display="flex" alignItems="center">
            <Box width="100%" mr={1}>
                <LinearProgress variant="determinate" {...props} />
            </Box>
            <Box minWidth={35}>
                <Typography variant="body2" color="textSecondary">{`${Math.round(
                    props.value,
                )}%`}</Typography>
            </Box>
        </Box>
    );
}

export default function MainPage({prompts, setPrompts}: StandardComponentProps) {
    const [chooseTheme, setChooseTheme] = React.useState('');
    const [chooseSection, setChooseSection] = React.useState('');
    const classes = useStyles();
    const [auth, setAuth] = useState(false);
    const [sections, setSections] = useState([]);
    const [helloPic, setHelloPic] = useState(false);

    const [text, setText] = useState('');
    const [code, setCode] = useState('');
    const [promptText, setPromptText] = React.useState("");

    const [count, setCount] = React.useState(0);

    const [endLists, setEndLists] = React.useState(false);
    const [startList, setStartList] = React.useState(true);

    const [openHelpSnake, setOpenHelpSnake] = React.useState(false);

    const handleClick = () => {
        setAuth(!auth);
        setChooseSection("");
        setChooseTheme("");
    };

    const counterList = (theme: string) => {
        int = 0;
        let key = chooseSection + "," + theme + "," + int;
        while(mapContentHelp.has(key)){
            int++;
            key = chooseSection + "," + theme + "," + int;
        }
    };

    const chooseSectionTheme = (theme: string) => {
        setOpenHelpSnake(false);
        setCount(helpCount);
        let key = chooseSection + "," + theme + "," + helpCount;
        counterList(theme)
        if(mapContentHelp.has(key)){
            setText(mapContentHelp.get(key)[0]);
        }
        if(mapContentHelp.has(key)){
            setCode(mapContentHelp.get(key)[1]);
        }
        if(mapContentHelp.has(key)){
            setPromptText(mapContentHelp.get(key)[2]);
        }
    };

    const backList = () => {
        helpCount -= 1;
        console.log(helpCount);
        setEndLists(false);
        if(helpCount === 0){
            setStartList(true);
        }
        chooseSectionTheme(chooseTheme);
    };

    const helpButtonClick = () => {
        setOpenHelpSnake(!openHelpSnake);
        setCode(promptText);
    };

    const saveList = () => {
        helpCount += 1;
        console.log(helpCount);
        setStartList(false);
        if(helpCount === int - 1){
            setEndLists(true);
        }
        chooseSectionTheme(chooseTheme);
    };

    window.onload=()=>{
        console.log("задаем map")
        Api.getContent("menu").then((data)=>{
            console.log(data);
            map2 = new Map(Object.entries(data));
            console.log(map2);
            map2.forEach((value:string[], key: string)=>{
                sectionsHelp = [...sectionsHelp, [key, value]];
                // @ts-ignore
                setSections(sectionsHelp);
                console.log("меню", sectionsHelp);
            });
        })
        Api.getContent("content").then((data)=>{
            console.log("лекции", data);
            mapContentHelp = new Map(Object.entries(data));
            console.log("лекции", mapContentHelp);
        })
    }
    if (!auth)
    return (
        <Container component="main" maxWidth="lg">
            <Grid container spacing={1}>
                <Grid item xs={12}>
                    <Grid container>
                        <Grid item xs={12} sm={3}>
                            <Paper className={classes.paper}>
                                <div>
                                    <img src={logoMainPage} alt={"cannot display"} style={{height: "10vh", marginLeft: "3vh"}}/>
                                </div>
                                <Button variant="outlined" color="primary" onClick={handleClick}>
                                    Авторизоваться как преподаватель
                                </Button>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} sm={9}>
                            <Paper className={classes.paper} style={{height: "16.6vh"}}>
                                {
                                    chooseSection
                                }
                                |
                                {
                                    chooseTheme
                                }
                            </Paper>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} sm={3}>
                    <Paper className={classes.paper}>
                        <TableOfContents isTeacher={false} prompts={prompts} setPrompts={setPrompts} map2={map2} sections={sections} setSections={setSections} sectionsHelp={sectionsHelp} chooseTheme={chooseTheme} setChooseTheme={setChooseTheme} chooseSection={chooseSection} setChooseSection={setChooseSection} chooseSectionTheme={chooseSectionTheme} openHelpSnake={openHelpSnake}/>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={9}>
                    <Paper className={classes.paper} style={{height: "71.8vh"}}>
                        <div style={{display: chooseTheme === ""? "inline":"none"}}>
                            <img src={Hello1} onClick={()=> setHelloPic(true)} alt={"cannot display"} style={{marginTop: "20vh", display: !helloPic? "inline":"none"}}/>
                            <img src={Hello2} onClick={()=> setHelloPic(false)} alt={"cannot display"} style={{marginTop: "20vh", display: helloPic? "inline":"none"}}/>
                        </div>
                        <div style={{display: chooseTheme !== ""? "inline":"none"}}>
                            <Button><a href="https://colab.research.google.com/github/PolyRibina/neural_network/blob/main/Topic%201_Class.ipynb" rel="noreferrer"><GitHubIcon/></a></Button>
                            <LinearProgressWithLabel value={100 / int * (count + 1)} />
                            <Paper>
                                <p style={{height: '30vh'}}>{text}</p>
                            </Paper>
                            <Grid container spacing={10}>
                                <Grid item xs={12} sm={1}>
                                    <ButtonGroup
                                        orientation="vertical"
                                        color="primary"
                                        aria-label="vertical outlined primary button group"
                                    >
                                        <Button color="primary"
                                                aria-label="vertical outlined primary button group"
                                                style={{marginRight: '850px', border: "1px solid"}}
                                                onClick={helpButtonClick}
                                        ><LiveHelpIcon/>
                                        </Button>
                                    </ButtonGroup>
                                </Grid>
                                <Grid item xs={12} sm={11}>
                                    <TextField
                                        label="Код"
                                        style={{width: "100%"}}
                                        multiline
                                        disabled={true}
                                        rows={10}
                                        defaultValue=''
                                        value={code}
                                        variant="outlined"
                                    />
                                </Grid>
                            </Grid>
                            <Grid container>
                                <Grid item xs={12} sm={4}>
                                    <p style={{marginTop: '2.7vh', marginLeft: '44vh'}}>{count + 1}</p>
                                </Grid>
                                <Grid item xs={12} sm={8}>
                                    <ButtonGroup
                                        orientation="horizontal"
                                        color="primary"
                                        aria-label="vertical outlined primary button group"
                                        style={{marginTop: '2.1vh', marginLeft: '32.7vh'}}
                                    >
                                        <Button onClick={backList} disabled={startList}><ArrowBackIcon/></Button>
                                        <Button onClick={saveList} disabled={endLists}><ArrowForwardIcon/></Button>
                                    </ButtonGroup>
                                </Grid>
                            </Grid>

                        </div>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
    else{
        return (
            <AuthPage prompts={prompts} setPrompts={setPrompts} map2={map2} sections={sections} setSections={setSections} sectionsHelp={sectionsHelp} handleClick={handleClick} chooseTheme={chooseTheme} setChooseTheme={setChooseTheme} mapContent={mapContent} chooseSection={chooseSection} setChooseSection={setChooseSection}/>
        );
    }
}