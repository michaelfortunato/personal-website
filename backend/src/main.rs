use personal_website::Config;
/// Consider the main.rs file to be one such consumer of the personal-website
/// library crate.
/// As such, Let us have the main.rs file define its api, which, because
/// it's an executable MUST must be using stdin and stdout of the process.
use std::{env, net::IpAddr};

use clap::Parser;
#[derive(Debug, Parser)]
#[command(version, about, long_about = None)]
struct Cli {
    /// The address to which the http server will bind
    #[arg(short, long, default_value = "0.0.0.0")]
    ip: IpAddr,
    /// The port to which the http server will bind
    #[arg(short, long, default_value_t = 8080)]
    port: u16,
    /// The number of threads the http server will have access to
    #[arg(short = 't', long, default_value_t = 2)]
    number_of_threads: u16,

    /// The database_url *should* be passed via the environment variable
    /// DATABASE_URL
    #[arg(
        env,
        // hide = true,
    )]
    database_url: String,
}

impl From<Cli> for Config {
    fn from(cli: Cli) -> Self {
        Config {
            ip: cli.ip,
            port: cli.port,
            number_of_threads: cli.number_of_threads,
            database_url: cli.database_url,
        }
    }
}

fn main() {
    let cli = Cli::parse();
    let config = Config::from(cli);

    install_logger();
    personal_website::run(config);
}

fn install_logger() {
    tracing_subscriber::fmt::fmt().init();
}

#[test]
fn verify_cli() {
    use clap::CommandFactory;
    Cli::command().debug_assert();
}
