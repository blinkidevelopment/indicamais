using IndicaMais.DbContexts;
using Newtonsoft.Json;

namespace IndicaMais.Services.Integrations
{
    public class ViosService
    {
        private readonly HttpClient _httpClient;
        private readonly string urlBase = Parametros.ViosBaseUrl;

        public ViosService(HttpClient httpClient)
        {
            _httpClient = httpClient;
            _httpClient.DefaultRequestHeaders.Add("Authorization-Vios", Parametros.TokenVios);
        }

        public async Task<bool> VerificarCadastro(string cpf)
        {
            var response = await _httpClient.GetAsync(urlBase + cpf);
            response.EnsureSuccessStatusCode();
            var conteudo = await response.Content.ReadAsStringAsync();
            var responseObj = JsonConvert.DeserializeObject<RespostaAPI>(conteudo);
            return responseObj!.Esta_Cadastrado;
        }

        public class RespostaAPI
        {
            public bool Esta_Cadastrado { get; set; }
            public int Id { get; set; }
        }
    }
}
