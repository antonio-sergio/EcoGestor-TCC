import React, { useState, useEffect, useContext } from 'react';
import collectService from '../../services/collect/collect-service';
import addressService from '../../services/address/address-service';
import { toast, ToastContainer } from 'react-toastify';
import { TextField, Button, Box, Typography, Dialog, DialogTitle, DialogContent, DialogActions, CardMedia, Card } from '@mui/material';
import DatePicker from 'react-datepicker';
import { registerLocale, setDefaultLocale } from "react-datepicker";
import { format, startOfDay, addDays } from 'date-fns';
import pt from 'date-fns/locale/pt-BR';
import AuthContext from '../../services/auth/AuthContext';
import imageCalendar from "../../assets/images/calendar.png";
import emailService from '../../services/email/email-service';
registerLocale('pt', pt);

const CollectForm = () => {
    const { user } = useContext(AuthContext);

    const [collects, setCollects] = useState([]);
    const [address, setAddress] = useState([]);
    const [selectedDate, setSelectedDate] = useState(addDays(new Date(), 3));
    const [selectedTime, setSelectedTime] = useState('');
    const [openModal, setOpenModal] = useState(false);
    const [edited, setEdited] = useState(false);
    const [created, setCreated] = useState(false);
    const [block, setBlock] = useState(false);

    useEffect(() => {
        const formattedDate = format(startOfDay(selectedDate), 'yyyy-MM-dd');
        collectService
            .getCollectsByDate(formattedDate)
            .then(response => {
                if (response.status === 200) {
                    setCollects(response.data);
                }
            })
            .catch(error => console.log(error));
    }, [selectedDate, created]);

    useEffect(() => {
        addressService.getOneAddress(user?.address_id)
            .then(response => {
                if (response.status === 200) {
                    setAddress(response.data);
                }
            })
            .catch(error => console.log(error));
    }, [user, edited]);

    console.log('userr', user)
    const scheduleList = ["08:00:00", "08:30:00", "09:00:00", "09:30:00", "10:00:00", "10:30:00", "11:00:00", "11:30:00", "12:00:00", "12:30:00", "13:00:00", "13:30:00", "14:00:00", "14:30:00", "15:00:00", "15:30:00", "16:00:00", "16:30:00", "17:00:00", "17:30:00"];

    const handleChangeDate = (date) => {
        const currentDate = new Date();
        const minDate = addDays(currentDate, 2); // Duas datas à frente da atual

        if (date < minDate) {
            toast.warning('Por favor, escolha uma data pelo menos dois dias à frente da data atual');
            setBlock(true);
            return;
        }

        if (date.getDay() === 6 || date.getDay() === 0) {
            toast.warning('Por favor, escolha um dia entre segunda e sexta-feira');
            setBlock(true);
            return; // Ignorar a atualização do estado
        }

        setBlock(false);
        setSelectedDate(date);
    };

    const handleChangeTime = (e) => {
        const time = e.target.value;
        setSelectedTime(time);
    };

    const handleSaveAddress = () => {
        let numberCep = extrairNumeros(address.zip_code);
        console.log('number cep', numberCep)
        address.zip_code = String(numberCep);
        if (String(address.state).toLowerCase() === 'sp' && String(address.city).toLowerCase() === 'franca') {
            addressService.updateAddress(address).then(response => {
                console.log('response update', response)
                if (response.status === 200) {
                    toast.success('Endereço atualizado com sucesso!');
                    if (edited === true) {
                        setEdited(false)
                    } else {
                        setEdited(true)
                    }
                    setOpenModal(false);
                }
            }).catch(error => {
                console.log(error);
                toast.error('Não foi possível atualizar o endereço.')
            })
        } else {
            toast.warning('Desculpe-nos! Por enquanto só atendemos a cidade de Franca-SP')

        }

    };

    function extrairNumeros(string) {
        // eslint-disable-next-line
        var regex = /\d+[\+\.,]?\d*|-\d+[\+\.,]?\d*/g;
        var numeros = string.match(regex);
        if (numeros) {
            numeros = numeros.map(function (num) {
                return num.replace(/[-]/g, '');
            });
        } else {
            numeros = [];
        }
        console.log('numeros', numeros)
        if (numeros[1]) {
            return Number(numeros[0] + numeros[1]);
        }
        return Number(numeros[0]);
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        const formattedDate = format(startOfDay(selectedDate), 'yyyy-MM-dd');
        const formattedDateEmail = format(startOfDay(selectedDate), 'dd-MM-yyyy');
        let payload = {
            user_id: user?.id,
            collect_time: selectedTime,
            collect_date: formattedDate,
            address_id: user.address_id,
            details_address: address.street + ' ' + address.number + ', ' + address.neighborhood + ', ' + address.city + ' ' + address.state + '. ' + address?.complement + ' ' + address.zip_code + '.'
        }
        collectService.create(payload).then(response => {
            if (response.status === 201) {
                try {
                    const obj = {
                        "recipient": user?.email,
                        "user": user?.name,
                        "textMsg": "Recebemos sua solicitação de coleta e em breve ela passará por uma análise e retornaremos com mais informações. Por favor aguarde!",
                        "date" : formattedDateEmail,
                        "schedule": payload.collect_time,
                        "address": payload.details_address
                    }
                    emailService.sendEmail(obj)
                } catch (error) {
                    console.log(error);
                }
                toast.success('Coleta agendada com sucesso!');
                if (created === true) {
                    setCreated(false)
                } else {
                    setCreated(true)
                }
                setSelectedTime("");
            }
        }).catch(error => {
            console.log(error);
            toast.error('Não foi possível agendar a coleta!')
        })
    };

    return (
        <>
            <ToastContainer />
            <Box >
                <Box>
                    <DatePicker
                        selected={selectedDate}
                        onChange={handleChangeDate}
                        dateFormat="dd/MM/yyyy" // Define o formato de data local
                        placeholderText="Selecione uma data"
                        locale="pt"
                        style={{ color: "red" }}
                    />
                </Box>
                <form style={{ zIndex: 1, marginTop: "20px" }} onSubmit={handleSubmit}>
                    <TextField
                        name="collect_time"
                        value={selectedTime}
                        onChange={handleChangeTime}
                        required
                        select
                        SelectProps={{
                            native: true,
                        }}
                    >
                        <option value="" disabled>
                            Selecione um horário
                        </option>
                        {scheduleList.map((time) => {
                            const isDisabled = collects.some(
                                (collect) => collect.collect_time === time && collect.status !== 'recusada'

                            );
                            return (
                                !isDisabled ?
                                    <option key={time} style={{}} value={time} disabled={isDisabled}>
                                        {time}
                                    </option> : ""
                            );
                        })}
                    </TextField>
                    <Box mt={5}>
                        <Typography variant="body1"><strong>Logradouro:</strong> {address?.street}</Typography>
                        <Typography variant="body1"><strong>Número:</strong> {address?.number}</Typography>
                        <Typography variant="body1"><strong>Bairro:</strong> {address?.neighborhood}</Typography>
                        <Typography variant="body1"><strong>Cidade:</strong> {address?.city}</Typography>
                        <Typography variant="body1"><strong>Estado:</strong> {address?.state}</Typography>
                        <Typography variant="body1"><strong>CEP:</strong> {address?.zip_code}</Typography>
                        {address?.complement && <Typography variant="body1"><strong>Complemento:</strong> {address?.complement}</Typography>}
                    </Box>
                    <Button
                        sx={{ height: 53, marginTop: 2, }}
                        type="button"
                        variant="outlined"
                        color="success"
                        onClick={() => setOpenModal(true)}
                    >
                        editar endereço
                    </Button>
                    <Button
                        sx={{ height: 53, marginTop: 2, marginRight: 4 }}
                        type="submit"
                        variant="contained"
                        color="success"
                        disabled={block}
                    >
                        agendar coleta
                    </Button>

                </form>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
                <Card>
                    <CardMedia
                        component="img"
                        alt="Logomarca da EcoGestor"
                        height="400"
                        image={imageCalendar}
                    />
                </Card>
            </Box>
            <Dialog open={openModal} onClose={() => setOpenModal(false)}>
                <DialogTitle fontWeight={800} textAlign="center" sx={{ backgroundColor: 'green', color: 'white' }}>
                    Editar Endereço
                </DialogTitle>
                <DialogContent sx={{ marginTop: 3 }}>
                    <>
                        <TextField
                            label="Logradouro"
                            defaultValue={address?.street || ''}
                            onChange={(e) => setAddress({ ...address, street: e.target.value })}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="Número"
                            value={address?.number || ''}
                            onChange={(e) => setAddress({ ...address, number: e.target.value })}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="Bairro"
                            value={address?.neighborhood || ''}
                            onChange={(e) => setAddress({ ...address, neighborhood: e.target.value })}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="Cidade"
                            value={address?.city || ''}
                            onChange={(e) => setAddress({ ...address, city: e.target.value })}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="Estado"
                            value={address?.state || ''}
                            onChange={(e) => setAddress({ ...address, state: e.target.value })}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="CEP"
                            value={address?.zip_code || ''}
                            onChange={(e) => setAddress({ ...address, zip_code: e.target.value })}
                            fullWidth
                            margin="normal"
                            inputProps={{
                                maxLength: 9, 
                            }}
                        />
                        <TextField
                            label="Complemento"
                            value={address?.complement || ''}
                            onChange={(e) => setAddress({ ...address, complement: e.target.value })}
                            fullWidth
                            margin="normal"
                        />
                    </>
                </DialogContent>
                <DialogActions>
                    <>
                        <Button onClick={handleSaveAddress}>Salvar</Button>
                        <Button onClick={() => setOpenModal(false)}>Cancelar</Button>
                    </>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default CollectForm;
