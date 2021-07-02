import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {
    ButtonGroup,
    Container,
    Dialog, DialogActions,
    DialogContent, DialogContentText,
    TextField
} from "@material-ui/core";
import logoMainPage from './logoMainPage.png';
import TableOfContents from "./TableOfContents";
import Button from '@material-ui/core/Button';
import React, {Dispatch, SetStateAction} from "react";
import LiveHelpIcon from '@material-ui/icons/LiveHelp';
import PopupState from "material-ui-popup-state";
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Api from "./Api";
import GitHubIcon from "@material-ui/icons/GitHub";
import HelloBoss from "./ПриветствиеПреподаватель.png";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        paper: {
            padding: theme.spacing(2),
            textAlign: 'center',
            color: theme.palette.text.secondary,
        },
        root: {
            height: 180,
        },
        wrapper: {
            width: 100 + theme.spacing(2),
        },
        svg: {
            width: 100,
            height: 100,
        },
        polygon: {
            fill: theme.palette.common.white,
            stroke: theme.palette.divider,
            strokeWidth: 1,
        },
    }),
);
interface StandardComponentProps{
    chooseTheme: string
    setChooseTheme: Dispatch<SetStateAction<string>>
    prompts: string[]
    setPrompts: Dispatch<SetStateAction<never[]>>
    setSections: Dispatch<SetStateAction<never[]>>
    sectionsHelp: any[]
    map2: Map<string, string[]>
    mapContent: Map<string[], string[]>
    handleClicks: () => void
    sections: any[]
    chooseSection: string
    setChooseSection: Dispatch<SetStateAction<string>>
}

let currentPrompt: string;
let listArray: string[]=[];
let mapContentHelp = new Map()
let helpCount: number = 0;

export default function MainPageForTeacher({map2, handleClicks, sections, setSections, sectionsHelp, prompts, setPrompts, chooseTheme, setChooseTheme, mapContent, chooseSection, setChooseSection}: StandardComponentProps) {

    const classes = useStyles();
    const [openAddPrompt, setOpenAddPrompt] = React.useState(false);
    const [openLinkColab, setOpenLinkColab] = React.useState(false);
    const [openLinkDZ, setOpenLinkDZ] = React.useState(false);

    const [promptText, setPromptText] = React.useState("");
    const [linkText, setLinkText] = React.useState("");
    const [linkTextDZ, setLinkTextDZ] = React.useState("");

    const [text, setText] = React.useState('');
    const [code, setCode] = React.useState('');

    const [count, setCount] = React.useState(0);

    const [startList, setStartList] = React.useState(true);


    const helpButtonClick = () => {
        setOpenAddPrompt(true);
    };

    const addPromptClose = () => {
        setPromptText('');
        setOpenAddPrompt(false);
    };

    const addPromptSave = () => {
        currentPrompt = promptText;
        setPromptText('');
        addPromptClose();
    };

    const mapToObj = (inputMap: Map<string[], string[]>) => {
        let obj = {};
        inputMap.forEach((value: string[], key: string[]) => {
            // @ts-ignore
            obj[key] = value
        });

        return obj;
    }

    const saveList = () => {
        if(text === ""){
            alert("Заполните хотя бы текст лекции!")
            return
        }
        helpCount += 1;
        setStartList(false);

        listArray.push(listArray.length.toString());
        setCount(helpCount);
        console.log(helpCount);

        mapContent.set([chooseSection, chooseTheme, (helpCount-1).toString()], [text, code, currentPrompt, linkText, linkTextDZ]);
        console.log("ТО", mapContent);

        setText('');
        setCode('');

        chooseSectionTheme(chooseTheme);
    };

    const saveTheme = () => {
        saveList();

        let n = helpCount-1;
        mapContent.forEach((value: string[], key: string[])=>{
            if(key[0] === chooseSection && key[1] === chooseTheme && key[2] === n.toString()){
                console.log("успешно сохранено")

                Api.getContent("content").then((data)=>{
                    mapContentHelp = new Map(Object.entries(data));
                })

                mapContent.forEach((value: string[], key: string[])=>{
                    mapContentHelp.set(key, value);
                })

                Api.setContent("content", JSON.stringify(mapToObj(mapContentHelp))).then(() => {
                    console.log("success set list");
                })
            }
            else if(key[0] !== chooseSection && key[1] !== chooseTheme){
                alert("Нельзя сохранить пустую тему!");
                return;
            }
            else {
                console.log("ОЩТБКА")
                console.log(chooseSection, chooseTheme, n)
            }
        })

        setChooseTheme('');
    };

    const helpCountNull = ()=>{
        console.log("Обнуляем")
        helpCount = 0;
    }

    const chooseSectionTheme = (theme: string) => {
        //setCount(count+1);
        Api.getContent("content").then((data)=>{
            mapContentHelp = new Map(Object.entries(data));
            console.log("страница", helpCount);
            let key = chooseSection +"," + theme + "," + helpCount;
            console.log(key);
            console.log("фикс ошибки", mapContentHelp)
            if(mapContentHelp.has(key)){
                setText(mapContentHelp.get(key)[0]);
                setCode(mapContentHelp.get(key)[1]);
                setPromptText(mapContentHelp.get(key)[2]);
                setLinkText(mapContentHelp.get(key)[3]);
                setLinkTextDZ(mapContentHelp.get(key)[4]);
            }
            else{
                setText('');
                setCode('');
                setPromptText('');
                //setLinkText('');
                console.log("Все очистили")
            }

        })
    };

    const backList = () => {
        if(helpCount === 0){
            setStartList(true);
            return
        }
        helpCount -= 1;
        console.log(helpCount);
        if(helpCount === 0){
            setStartList(true);
        }
        setCount(helpCount);
        chooseSectionTheme(chooseTheme);
    };

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
                                <Button variant="outlined" color="primary" onClick={handleClicks}>
                                    Выйти из режима преподавателя
                                </Button>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} sm={9}>
                            <Paper className={classes.paper} style={{height: "20vh"}}>
                                <div style={{marginTop: '5vh'}}>
                                    <p style={{display: chooseSection !== ""? "inline":"none", fontFamily: 'Andale Mono, monospace', fontSize: '200%'}}>
                                        {
                                            chooseSection + " > "
                                        }

                                        {
                                            chooseTheme
                                        }
                                    </p>
                                </div>
                            </Paper>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} sm={3}>
                    <Paper className={classes.paper}>
                        <TableOfContents isTeacher={true} prompts={prompts} map2={map2} sections={sections} setSections={setSections} sectionsHelp={sectionsHelp} setPrompts={setPrompts} chooseTheme={chooseTheme} setChooseTheme={setChooseTheme} chooseSection={chooseSection} setChooseSection={setChooseSection} chooseSectionTheme={chooseSectionTheme} openHelpSnake={false} setCount={setCount} helpCountNull={helpCountNull} openNoneController={()=>{}}/>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={9} style={{display: chooseTheme !== ""? "inline":"none"}}>
                    <Paper className={classes.paper}>
                        <Button size="small" color="primary" variant="contained" style={{marginBottom: '0.2vh', display: helpCount === 0? "inline":"none", borderRadius: '1vh', marginRight: '10vh'}} onClick={()=>{setOpenLinkColab(true)}}><GitHubIcon /> Вставить ссылку на Colab</Button>
                        <Button size="small" color="primary" variant="contained" style={{marginBottom: '0.2vh', display: helpCount === 0? "inline":"none", borderRadius: '1vh'}} onClick={()=>{setOpenLinkDZ(true)}}><GitHubIcon /> Вставить ссылку на Colab (Д/З)</Button>
                        <Dialog open={openLinkColab} onClose={()=>{setOpenLinkColab(false)}} aria-labelledby="form-dialog-title">
                            <DialogContent style={{width: '500px'}}>
                                <DialogContentText>
                                    Введите ссылку на тему
                                </DialogContentText>
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    label="Ссылка"
                                    multiline
                                    rows={10}
                                    fullWidth
                                    defaultValue=''
                                    value={linkText}
                                    onChange={e =>{setLinkText(e.target.value)}}
                                />
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={()=>{setOpenLinkColab(false)}} color="primary">
                                    Отменить
                                </Button>
                                <Button onClick={()=>{setOpenLinkColab(false)}} color="primary">
                                    Сохранить
                                </Button>
                            </DialogActions>
                        </Dialog>
                        <Dialog open={openLinkDZ} onClose={()=>{setOpenLinkDZ(false)}} aria-labelledby="form-dialog-title">
                            <DialogContent style={{width: '500px'}}>
                                <DialogContentText>
                                    Введите ссылку на домашнее задание
                                </DialogContentText>
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    label="Ссылка"
                                    multiline
                                    rows={10}
                                    fullWidth
                                    defaultValue=''
                                    value={linkTextDZ}
                                    onChange={e =>{setLinkTextDZ(e.target.value)}}
                                />
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={()=>{setOpenLinkDZ(false)}} color="primary">
                                    Отменить
                                </Button>
                                <Button onClick={()=>{setOpenLinkDZ(false)}} color="primary">
                                    Сохранить
                                </Button>
                            </DialogActions>
                        </Dialog>
                        <TextField
                            label="Текст лекции"
                            style={{width: "100%", height: "100%", marginBottom: "2.5vh"}}
                            multiline
                            rows={18}
                            defaultValue=""
                            value={text}
                            variant="outlined"
                            onChange={e =>{setText(e.target.value)}}
                        />
                        <Grid container spacing={10}>
                            <Grid item xs={12} sm={1}>
                                <PopupState variant="popover" popupId="demo-popup-menu">
                                    {(popupState) => (
                                        <React.Fragment>
                                            <Button
                                                color="primary"
                                                aria-label="vertical outlined primary button group"
                                                style={{marginRight: '850px', border: "1px solid"}}
                                                onClick={helpButtonClick}><LiveHelpIcon/>

                                            </Button>
                                            <Dialog open={openAddPrompt} onClose={addPromptClose} aria-labelledby="form-dialog-title">
                                                <DialogContent style={{width: '500px'}}>
                                                    <DialogContentText>
                                                        Введите текст подсказки
                                                    </DialogContentText>
                                                    <TextField
                                                        autoFocus
                                                        margin="dense"
                                                        label="Подсказка"
                                                        multiline
                                                        rows={10}
                                                        fullWidth
                                                        defaultValue=''
                                                        value={promptText}
                                                        onChange={e =>{setPromptText(e.target.value)}}
                                                    />
                                                </DialogContent>
                                                <DialogActions>
                                                    <Button onClick={addPromptClose} color="primary">
                                                        Отменить
                                                    </Button>
                                                    <Button onClick={addPromptSave} color="primary">
                                                        Сохранить
                                                    </Button>
                                                </DialogActions>
                                            </Dialog>
                                        </React.Fragment>
                                    )}
                                </PopupState>
                            </Grid>
                            <Grid item xs={12} sm={11}>
                                <TextField
                                    label="Код"
                                    style={{width: "100%"}}
                                    multiline
                                    rows={10}
                                    defaultValue=''
                                    value={code}
                                    variant="outlined"
                                    onChange={e =>{setCode(e.target.value)}}
                                />
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid item xs={12} sm={4}>
                                <p style={{marginTop: '2.7vh', marginLeft: '44vh'}}>{count+1}</p>
                            </Grid>
                            <Grid item xs={12} sm={8}>
                                <ButtonGroup
                                    orientation="horizontal"
                                    color="primary"
                                    aria-label="vertical outlined primary button group"
                                    style={{marginTop: '2.1vh', marginLeft: '32.7vh'}}
                                >
                                    <Button onClick={()=>{backList()}} disabled={startList}><ArrowBackIcon/></Button>
                                    <Button onClick={saveList}>
                                        <ArrowForwardIcon/>
                                    </Button>
                                    <Button onClick={saveTheme}>Сохранить тему</Button>
                                </ButtonGroup>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={9} style={{display: chooseTheme === ""? "inline":"none"}}>
                    <Paper className={classes.paper} style={{height: '78.4vh'}}>
                        <div style={{display: chooseTheme === ""? "inline":"none"}}>
                            <img src={HelloBoss} alt={"cannot display"} style={{marginTop: "20vh"}}/>
                        </div>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
}