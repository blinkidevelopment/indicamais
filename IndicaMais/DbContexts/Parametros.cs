namespace IndicaMais.DbContexts
{
    public class Parametros
    {
        private static IConfiguration _configuration;

        public static string CodConexao { get { return _configuration["CONNECTION_STRING"]; } }
        public static string Issuer { get { return _configuration["ISSUER"]; } }
        public static string Audience { get { return _configuration["AUDIENCE"]; } }
        public static string SecurityKey { get { return _configuration["SECURITY_KEY"]; } }
        public static string TokenAsaas { get { return _configuration["TOKEN_ASAAS"]; } }
        public static string TokenVios { get { return _configuration["TOKEN_VIOS"]; } }
        public static string AsaasBaseUrl { get { return _configuration["BASE_URL_ASAAS"]; } }
        public static string ViosBaseUrl { get { return _configuration["BASE_URL_VIOS"]; } }

        static Parametros()
        {
            _configuration = new ConfigurationBuilder()
                .AddEnvironmentVariables()
                .Build();
        }
    }
}
