import React from 'react';
import axios from 'axios'
import { isObject } from 'util';
import Logo from '../img/logo.png'


class accueil extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            /* state de la liste des cryptocurrencies contenant les informations des différentes blockchain */
            cryptocurrencies_list: [],
            cryptocurrencies_numbers: null,
            selectedCrypto: null,

            convert_currency: "USD",

            searchBarValue: "",
            /* tableau avec les cryptomonnaies qui correspondes à la recherche */
            searchBarResult: [],
        }
        this.handleChangeSearchBar = this.handleChangeSearchBar.bind(this);
        this.handleChangeOption = this.handleChangeOption.bind(this);
        this.sortBy = this.sortBy.bind(this);
        this.selectCrypto = this.selectCrypto.bind(this);
        this.unselectCrypto = this.unselectCrypto.bind(this);
    }

    async componentDidMount() {

        /* fonction de base pour get les cryptomonnaies */
        fetch('https://api.coinmarketcap.com/v2/ticker/?convert=' + this.state.convert_currency).then(res => res.json()).then(json => this.setState({ cryptocurrencies_list: json.data, cryptocurrencies_numbers: Object.keys(json.data).length }));

        /* fonction pour déplacer la barre avec les noms des différentes catégories en fonction du scroll */
        window.onscroll = function () {
            if (window.scrollY > document.getElementById('top_container_cryptocurrencies').offsetTop) {
                document.getElementById('container_lines_infos').style.position = "fixed";
                document.getElementById('container_lines_infos').style.top = "0";
                document.getElementById('container_lines_infos').style.width = "70%";
            } else {
                document.getElementById('container_lines_infos').style.position = "relative";
                document.getElementById('container_lines_infos').style.top = "0";
                document.getElementById('container_lines_infos').style.width = "100%";
            }
        }
    }

    /* fonctions pour appliquer les changements */
    handleChangeSearchBar(event) {
        this.setState({ [event.target.name]: event.target.value }, () => {

            /* check si les caractères entrés dans la searchBar sont égaux aux noms des cryptos */
            Object.keys(this.state.cryptocurrencies_list).map((key, index) => {
                if (this.state.cryptocurrencies_list[key].name.slice(0, this.state.searchBarValue.length).toLowerCase() === this.state.searchBarValue.toLowerCase()) {

                    /* si c'est bon on met le tableau des resultats à 0 et on push les cryptos dans le tableau */
                    this.setState({ searchBarResult: [] }, () => {
                        this.state.searchBarResult.push(this.state.cryptocurrencies_list[key]);
                        this.setState({ cryptocurrencies_numbers: this.state.searchBarResult.length })
                        /* force le re-render pour afficher les résultats */
                        this.forceUpdate();
                    })
                }
            })
        });

    }

    handleChangeOption(event) {
        let currency = event.target.value;
        /* Get le lien des cryptos en fonction de currency, la monnaie choisie */
        fetch('https://api.coinmarketcap.com/v2/ticker/?convert=' + currency).then(res => res.json()).then(json =>
            this.setState({ cryptocurrencies_list: json.data, convert_currency: currency })
        );
    }

    sortBy(parameter) {
        /* Get le lien pour trier en fonction du parameter envoyé (exemple: id, name etc..) et en fonction de la monnaie choisie */
        fetch('https://api.coinmarketcap.com/v2/ticker/?convert=' + this.state.convert_currency + "&sort=" + parameter).then(res => res.json()).then(json =>
            this.setState({ cryptocurrencies_list: json.data })
        );
    }

    selectCrypto(crypto) {
        console.log(this.state.cryptocurrencies_list[crypto]);
        this.setState({ selectedCrypto: this.state.cryptocurrencies_list[crypto] }, () => {
            document.getElementById('container_selected_crypto').style.left = "0%";
        })
    }

    unselectCrypto() {
        document.getElementById('container_selected_crypto').style.left = "100%";
        this.setState({ selectedCrypto: null });
    }


    render() {
        return (
            <div className="container_global">
                <img src={Logo} className="accueil_logo" />

                <input className="input_search_cryptocurrency" placeholder="Search By Name" name="searchBarValue" value={this.state.searchBarValue} onChange={this.handleChangeSearchBar} />
                <select className="currency_select" name="convert_currency" value={this.state.convert_currency} onChange={this.handleChangeOption}>
                    <option>USD</option>
                    <option>EUR</option>
                    <option>BTC</option>
                    <option>LTC</option>
                </select>

                <div className="container_cryptocurrencies" id="top_container_cryptocurrencies">
                    <div id="container_lines_infos">
                        <div className="cryptocurrency_info_id" onClick={() => { this.sortBy("id") }}>#</div>
                        <div className="cryptocurrency_info" onClick={() => { this.sortBy("name") }}>Name</div>
                        <div className="cryptocurrency_info" onClick={() => { this.sortBy("market_cap") }}>Market Cap</div>
                        <div className="cryptocurrency_info" onClick={() => { this.sortBy("price") }}>Price</div>
                        <div className="cryptocurrency_info" onClick={() => { this.sortBy("volume_24h") }}>Volume (24h)</div>
                        <div className="cryptocurrency_info" onClick={() => { this.sortBy("circulating_supply") }}>Circulating Supply</div>
                        <div className="cryptocurrency_info" onClick={() => { this.sortBy("percent_change_24h") }}>Change (24h)</div>
                    </div>

                    {this.state.searchBarValue.length === 0 && Object.keys(this.state.cryptocurrencies_list).length > 0 &&
                        <div>
                            {Object.keys(this.state.cryptocurrencies_list).map((key, index) =>
                                <div className="container_cryptocurrency" onClick={() => { this.selectCrypto(key) }}>
                                    <div className="cryptocurrency_info_id">{index + 1}</div>
                                    <div className="cryptocurrency_info"><img src={"https://s2.coinmarketcap.com/static/img/coins/16x16/" + key + ".png"} /> {this.state.cryptocurrencies_list[key].name}</div>
                                    <div className="cryptocurrency_info">{this.state.cryptocurrencies_list[key].quotes[this.state.convert_currency].market_cap}</div>
                                    <div className="cryptocurrency_info">{this.state.cryptocurrencies_list[key].quotes[this.state.convert_currency].price}</div>
                                    <div className="cryptocurrency_info">{this.state.cryptocurrencies_list[key].quotes[this.state.convert_currency].volume_24h}</div>
                                    <div className="cryptocurrency_info">{this.state.cryptocurrencies_list[key].circulating_supply}</div>
                                    <div className="cryptocurrency_info">{this.state.cryptocurrencies_list[key].quotes[this.state.convert_currency].percent_change_24h}%</div>
                                </div>
                            )}
                        </div>
                    }

                    {this.state.searchBarValue.length > 0 &&
                        <div>
                            {this.state.searchBarResult.map((crypto, index) =>
                                <div className="container_cryptocurrency" onClick={() => { this.selectCrypto(crypto.id) }}>
                                    <div className="cryptocurrency_info_id">{index + 1}</div>
                                    <div className="cryptocurrency_info"><img src={"https://s2.coinmarketcap.com/static/img/coins/16x16/" + crypto.id + ".png"} /> {crypto.name}</div>
                                    <div className="cryptocurrency_info">{crypto.quotes[this.state.convert_currency].market_cap}</div>
                                    <div className="cryptocurrency_info">{crypto.quotes[this.state.convert_currency].price}</div>
                                    <div className="cryptocurrency_info">{crypto.quotes[this.state.convert_currency].volume_24h}</div>
                                    <div className="cryptocurrency_info">{crypto.circulating_supply}</div>
                                    <div className="cryptocurrency_info">{crypto.quotes[this.state.convert_currency].percent_change_24h}%</div>
                                </div>
                            )}
                        </div>
                    }
                </div>

                {/* container qui glisse de la gauche quand on selectionne une crypto */}

                <div className="container_selected_crypto" id="container_selected_crypto">
                    <img src={Logo} className="accueil_logo" />
                    <button className="button_close_container_selected_crypto" onClick={this.unselectCrypto}><i class="fas fa-times"></i></button>
                    {this.state.selectedCrypto &&
                        <div className="container_infos_selected_crypto">
                            <div className="selected_crypto_title"><img className="selected_crypto_logo" src={"https://s2.coinmarketcap.com/static/img/coins/32x32/" + this.state.selectedCrypto.id + ".png"} /> {this.state.selectedCrypto.name} ({this.state.selectedCrypto.symbol})</div>
                            <button className="button_invest_crypto">INVEST IN</button>
                            <div className="selected_crypto_infos">Value : {this.state.selectedCrypto.quotes.USD.price.toFixed(2)}$ ({this.state.selectedCrypto.quotes[this.state.convert_currency].percent_change_24h}%)</div>
                            <div className="selected_crypto_infos">Market cap : {this.state.selectedCrypto.quotes.USD.market_cap}</div>
                            <div className="selected_crypto_infos">Volume (24h) : {this.state.selectedCrypto.quotes.USD.volume_24h}</div>
                            <div className="selected_crypto_infos">circulating supply : {this.state.selectedCrypto.circulating_supply}</div>
                            <div className="selected_crypto_infos">Percent change (24h) : {this.state.selectedCrypto.quotes.USD.percent_change_24h}%</div>
                            <div className="selected_crypto_infos">Last update : {new Date(this.state.selectedCrypto.last_updated * 1000).toString()}</div>
                        </div>
                    }
                </div>



            </div>
        )
    }
}

export default accueil;
